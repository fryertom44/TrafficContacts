(function(undefined) {
    "use strict";
    var _, Backbone, exports;
    if (typeof window == "undefined") {
        _ = require("alloy/underscore");
        Backbone = require("alloy/backbone");
        exports = module.exports = Backbone;
    } else {
        _ = window._;
        Backbone = window.Backbone;
        exports = window;
    }
    Backbone.Relational = {
        showWarnings: !0
    };
    Backbone.Semaphore = {
        _permitsAvailable: null,
        _permitsUsed: 0,
        acquire: function() {
            if (this._permitsAvailable && this._permitsUsed >= this._permitsAvailable) throw new Error("Max permits acquired");
            this._permitsUsed++;
        },
        release: function() {
            if (this._permitsUsed === 0) throw new Error("All permits released");
            this._permitsUsed--;
        },
        isLocked: function() {
            return this._permitsUsed > 0;
        },
        setAvailablePermits: function(amount) {
            if (this._permitsUsed > amount) throw new Error("Available permits cannot be less than used permits");
            this._permitsAvailable = amount;
        }
    };
    Backbone.BlockingQueue = function() {
        this._queue = [];
    };
    _.extend(Backbone.BlockingQueue.prototype, Backbone.Semaphore, {
        _queue: null,
        add: function(func) {
            this.isBlocked() ? this._queue.push(func) : func();
        },
        process: function() {
            while (this._queue && this._queue.length) this._queue.shift()();
        },
        block: function() {
            this.acquire();
        },
        unblock: function() {
            this.release();
            this.isBlocked() || this.process();
        },
        isBlocked: function() {
            return this.isLocked();
        }
    });
    Backbone.Relational.eventQueue = new Backbone.BlockingQueue;
    Backbone.Store = function() {
        this._collections = [];
        this._reverseRelations = [];
        this._orphanRelations = [];
        this._subModels = [];
        this._modelScopes = [ exports ];
    };
    _.extend(Backbone.Store.prototype, Backbone.Events, {
        initializeRelation: function(model, relation) {
            var type = _.isString(relation.type) ? Backbone[relation.type] || this.getObjectByName(relation.type) : relation.type;
            type && type.prototype instanceof Backbone.Relation ? new type(model, relation) : Backbone.Relational.showWarnings && typeof console != "undefined" && console.warn("Relation=%o; missing or invalid type!", relation);
        },
        addModelScope: function(scope) {
            this._modelScopes.push(scope);
        },
        addSubModels: function(subModelTypes, superModelType) {
            this._subModels.push({
                superModelType: superModelType,
                subModels: subModelTypes
            });
        },
        setupSuperModel: function(modelType) {
            _.find(this._subModels, function(subModelDef) {
                return _.find(subModelDef.subModels || [], function(subModelTypeName, typeValue) {
                    var subModelType = this.getObjectByName(subModelTypeName);
                    if (modelType === subModelType) {
                        subModelDef.superModelType._subModels[typeValue] = modelType;
                        modelType._superModel = subModelDef.superModelType;
                        modelType._subModelTypeValue = typeValue;
                        modelType._subModelTypeAttribute = subModelDef.superModelType.prototype.subModelTypeAttribute;
                        return !0;
                    }
                }, this);
            }, this);
        },
        addReverseRelation: function(relation) {
            var exists = _.any(this._reverseRelations, function(rel) {
                return _.all(relation || [], function(val, key) {
                    return val === rel[key];
                });
            });
            if (!exists && relation.model && relation.type) {
                this._reverseRelations.push(relation);
                this._addRelation(relation.model, relation);
                this.retroFitRelation(relation);
            }
        },
        addOrphanRelation: function(relation) {
            var exists = _.any(this._orphanRelations, function(rel) {
                return _.all(relation || [], function(val, key) {
                    return val === rel[key];
                });
            });
            !exists && relation.model && relation.type && this._orphanRelations.push(relation);
        },
        processOrphanRelations: function() {
            _.each(this._orphanRelations.slice(0), function(rel) {
                var relatedModel = Backbone.Relational.store.getObjectByName(rel.relatedModel);
                if (relatedModel) {
                    this.initializeRelation(null, rel);
                    this._orphanRelations = _.without(this._orphanRelations, rel);
                }
            }, this);
        },
        _addRelation: function(type, relation) {
            type.prototype.relations || (type.prototype.relations = []);
            type.prototype.relations.push(relation);
            _.each(type._subModels || [], function(subModel) {
                this._addRelation(subModel, relation);
            }, this);
        },
        retroFitRelation: function(relation) {
            var coll = this.getCollection(relation.model, !1);
            coll && coll.each(function(model) {
                if (!(model instanceof relation.model)) return;
                new relation.type(model, relation);
            }, this);
        },
        getCollection: function(type, create) {
            type instanceof Backbone.RelationalModel && (type = type.constructor);
            var rootModel = type;
            while (rootModel._superModel) rootModel = rootModel._superModel;
            var coll = _.findWhere(this._collections, {
                model: rootModel
            });
            !coll && create !== !1 && (coll = this._createCollection(rootModel));
            return coll;
        },
        getObjectByName: function(name) {
            var parts = name.split("."), type = null;
            _.find(this._modelScopes, function(scope) {
                type = _.reduce(parts || [], function(memo, val) {
                    return memo ? memo[val] : undefined;
                }, scope);
                if (type && type !== scope) return !0;
            }, this);
            return type;
        },
        _createCollection: function(type) {
            var coll;
            type instanceof Backbone.RelationalModel && (type = type.constructor);
            if (type.prototype instanceof Backbone.RelationalModel) {
                coll = new Backbone.Collection;
                coll.model = type;
                this._collections.push(coll);
            }
            return coll;
        },
        resolveIdForItem: function(type, item) {
            var id = _.isString(item) || _.isNumber(item) ? item : null;
            id === null && (item instanceof Backbone.RelationalModel ? id = item.id : _.isObject(item) && (id = item[type.prototype.idAttribute]));
            !id && id !== 0 && (id = null);
            return id;
        },
        find: function(type, item) {
            var id = this.resolveIdForItem(type, item), coll = this.getCollection(type);
            if (coll) {
                var obj = coll.get(id);
                if (obj instanceof type) return obj;
            }
            return null;
        },
        register: function(model) {
            var coll = this.getCollection(model);
            if (coll) {
                if (coll.get(model)) {
                    Backbone.Relational.showWarnings && typeof console != "undefined" && console.warn("Duplicate id! Old RelationalModel:%o, New RelationalModel:%o", coll.get(model), model);
                    throw new Error("Cannot instantiate more than one Backbone.RelationalModel with the same id per type!");
                }
                var modelColl = model.collection;
                coll.add(model);
                this.listenTo(model, "destroy", this.unregister, this);
                model.collection = modelColl;
            }
        },
        update: function(model) {
            var coll = this.getCollection(model);
            coll._onModelEvent("change:" + model.idAttribute, model, coll);
        },
        unregister: function(model) {
            this.stopListening(model, "destroy", this.unregister);
            var coll = this.getCollection(model);
            coll && coll.remove(model);
        },
        reset: function() {
            this.stopListening();
            this._collections = [];
            this._subModels = [];
            this._modelScopes = [ exports ];
        }
    });
    Backbone.Relational.store = new Backbone.Store;
    Backbone.Relation = function(instance, options) {
        this.instance = instance;
        options = _.isObject(options) ? options : {};
        this.reverseRelation = _.defaults(options.reverseRelation || {}, this.options.reverseRelation);
        this.options = _.defaults(options, this.options, Backbone.Relation.prototype.options);
        this.reverseRelation.type = _.isString(this.reverseRelation.type) ? Backbone[this.reverseRelation.type] || Backbone.Relational.store.getObjectByName(this.reverseRelation.type) : this.reverseRelation.type;
        this.key = this.options.key;
        this.keySource = this.options.keySource || this.key;
        this.keyDestination = this.options.keyDestination || this.keySource || this.key;
        this.model = this.options.model || this.instance.constructor;
        this.relatedModel = this.options.relatedModel;
        _.isString(this.relatedModel) && (this.relatedModel = Backbone.Relational.store.getObjectByName(this.relatedModel));
        if (!this.checkPreconditions()) return;
        !this.options.isAutoRelation && this.reverseRelation.type && this.reverseRelation.key && Backbone.Relational.store.addReverseRelation(_.defaults({
            isAutoRelation: !0,
            model: this.relatedModel,
            relatedModel: this.model,
            reverseRelation: this.options
        }, this.reverseRelation));
        if (instance) {
            var contentKey = this.keySource;
            contentKey !== this.key && typeof this.instance.get(this.key) == "object" && (contentKey = this.key);
            _.bindAll(this, "destroy", "_relatedModelAdded", "_relatedModelRemoved");
            this.setKeyContents(this.instance.get(contentKey));
            this.keySource !== this.key && this.instance.unset(this.keySource, {
                silent: !0
            });
            this.instance._relations.push(this);
            this.initialize();
            this.options.autoFetch && this.instance.fetchRelated(this.key, _.isObject(this.options.autoFetch) ? this.options.autoFetch : {});
            this.instance.on("destroy", this.destroy);
            Backbone.Relational.store.getCollection(this.relatedModel).on("relational:add", this._relatedModelAdded).on("relational:remove", this._relatedModelRemoved);
        }
    };
    Backbone.Relation.extend = Backbone.Model.extend;
    _.extend(Backbone.Relation.prototype, Backbone.Events, Backbone.Semaphore, {
        options: {
            createModels: !0,
            includeInJSON: !0,
            isAutoRelation: !1,
            autoFetch: !1
        },
        instance: null,
        key: null,
        keyContents: null,
        relatedModel: null,
        reverseRelation: null,
        related: null,
        _relatedModelAdded: function(model, coll, options) {
            var dit = this;
            model.queue(function() {
                dit.tryAddRelated(model, options);
            });
        },
        _relatedModelRemoved: function(model, coll, options) {
            this.removeRelated(model, options);
        },
        checkPreconditions: function() {
            var i = this.instance, k = this.key, m = this.model, rm = this.relatedModel, warn = Backbone.Relational.showWarnings && typeof console != "undefined";
            if (!m || !k || !rm) {
                warn && console.warn("Relation=%o; no model, key or relatedModel (%o, %o, %o)", this, m, k, rm);
                return !1;
            }
            if (m.prototype instanceof Backbone.RelationalModel) {
                if (rm.prototype instanceof Backbone.RelationalModel) {
                    if (this instanceof Backbone.HasMany && this.reverseRelation.type === Backbone.HasMany) {
                        warn && console.warn("Relation=%o; relation is a HasMany, and the reverseRelation is HasMany as well.", this);
                        return !1;
                    }
                    if (i && i._relations.length) {
                        var exists = _.any(i._relations || [], function(rel) {
                            var hasReverseRelation = this.reverseRelation.key && rel.reverseRelation.key;
                            return rel.relatedModel === rm && rel.key === k && (!hasReverseRelation || this.reverseRelation.key === rel.reverseRelation.key);
                        }, this);
                        if (exists) {
                            warn && console.warn("Relation=%o between instance=%o.%s and relatedModel=%o.%s already exists", this, i, k, rm, this.reverseRelation.key);
                            return !1;
                        }
                    }
                    return !0;
                }
                warn && console.warn("Relation=%o; relatedModel does not inherit from Backbone.RelationalModel (%o)", this, rm);
                return !1;
            }
            warn && console.warn("Relation=%o; model does not inherit from Backbone.RelationalModel (%o)", this, i);
            return !1;
        },
        setRelated: function(related) {
            this.related = related;
            this.instance.acquire();
            this.instance.attributes[this.key] = related;
            this.instance.release();
        },
        _isReverseRelation: function(relation) {
            return relation.instance instanceof this.relatedModel && this.reverseRelation.key === relation.key && this.key === relation.reverseRelation.key;
        },
        getReverseRelations: function(model) {
            var reverseRelations = [], models = _.isUndefined(model) ? this.related && (this.related.models || [ this.related ]) : [ model ];
            _.each(models || [], function(related) {
                _.each(related.getRelations() || [], function(relation) {
                    this._isReverseRelation(relation) && reverseRelations.push(relation);
                }, this);
            }, this);
            return reverseRelations;
        },
        sanitizeOptions: function(options) {
            options = options ? _.clone(options) : {};
            if (options.silent) {
                options.silentChange = !0;
                delete options.silent;
            }
            return options;
        },
        unsanitizeOptions: function(options) {
            options = options ? _.clone(options) : {};
            if (options.silentChange) {
                options.silent = !0;
                delete options.silentChange;
            }
            return options;
        },
        destroy: function() {
            this.instance.off("destroy", this.destroy);
            Backbone.Relational.store.getCollection(this.relatedModel).off("relational:add", this._relatedModelAdded).off("relational:remove", this._relatedModelRemoved);
            this instanceof Backbone.HasOne ? this.setRelated(null) : this instanceof Backbone.HasMany && this.setRelated(this._prepareCollection());
            _.each(this.getReverseRelations() || [], function(relation) {
                relation.removeRelated(this.instance);
            }, this);
        }
    });
    Backbone.HasOne = Backbone.Relation.extend({
        options: {
            reverseRelation: {
                type: "HasMany"
            }
        },
        initialize: function() {
            _.bindAll(this, "onChange");
            this.instance.on("relational:change:" + this.key, this.onChange);
            var model = this.findRelated();
            this.setRelated(model);
            _.each(this.getReverseRelations() || [], function(relation) {
                relation.addRelated(this.instance);
            }, this);
        },
        findRelated: function(options) {
            var model = null;
            if (this.keyContents instanceof this.relatedModel) model = this.keyContents; else if (this.keyContents || this.keyContents === 0) {
                var opts = _.defaults({
                    create: this.options.createModels
                }, options);
                model = this.relatedModel.findOrCreate(this.keyContents, opts);
            }
            return model;
        },
        setKeyContents: function(keyContents) {
            this.keyContents = keyContents;
            this.keyId = Backbone.Relational.store.resolveIdForItem(this.relatedModel, this.keyContents);
        },
        onChange: function(model, attr, options) {
            if (this.isLocked()) return;
            this.acquire();
            options = this.sanitizeOptions(options);
            var changed = _.isUndefined(options._related), oldRelated = changed ? this.related : options._related;
            if (changed) {
                this.setKeyContents(attr);
                if (this.keyContents instanceof this.relatedModel) this.related = this.keyContents; else if (this.keyContents) {
                    var related = this.findRelated(options);
                    this.setRelated(related);
                } else this.setRelated(null);
            }
            oldRelated && this.related !== oldRelated && _.each(this.getReverseRelations(oldRelated) || [], function(relation) {
                relation.removeRelated(this.instance, options);
            }, this);
            _.each(this.getReverseRelations() || [], function(relation) {
                relation.addRelated(this.instance, options);
            }, this);
            if (!options.silentChange && this.related !== oldRelated) {
                var dit = this;
                Backbone.Relational.eventQueue.add(function() {
                    dit.instance.trigger("update:" + dit.key, dit.instance, dit.related, options);
                });
            }
            this.release();
        },
        tryAddRelated: function(model, options) {
            if (this.related) return;
            if (this.keyId || this.keyId === 0) if (model.id === this.keyId) {
                options = this.sanitizeOptions(options);
                this.addRelated(model, options);
            }
        },
        addRelated: function(model, options) {
            if (model !== this.related) {
                var oldRelated = this.related || null;
                this.setRelated(model);
                this.onChange(this.instance, model, {
                    _related: oldRelated
                });
            }
        },
        removeRelated: function(model, options) {
            if (!this.related) return;
            if (model === this.related) {
                var oldRelated = this.related || null;
                this.setRelated(null);
                this.onChange(this.instance, model, {
                    _related: oldRelated
                });
            }
        }
    });
    Backbone.HasMany = Backbone.Relation.extend({
        collectionType: null,
        options: {
            reverseRelation: {
                type: "HasOne"
            },
            collectionType: Backbone.Collection,
            collectionKey: !0,
            collectionOptions: {}
        },
        initialize: function() {
            _.bindAll(this, "onChange", "handleAddition", "handleRemoval", "handleReset");
            this.instance.on("relational:change:" + this.key, this.onChange);
            this.collectionType = this.options.collectionType;
            _.isString(this.collectionType) && (this.collectionType = Backbone.Relational.store.getObjectByName(this.collectionType));
            if (!this.collectionType.prototype instanceof Backbone.Collection) throw new Error("`collectionType` must inherit from Backbone.Collection");
            this.keyContents instanceof Backbone.Collection ? this.setRelated(this._prepareCollection(this.keyContents)) : this.setRelated(this._prepareCollection());
            this.findRelated({
                silent: !0
            });
        },
        _getCollectionOptions: function() {
            return _.isFunction(this.options.collectionOptions) ? this.options.collectionOptions(this.instance) : this.options.collectionOptions;
        },
        _prepareCollection: function(collection) {
            this.related && this.related.off("relational:add", this.handleAddition).off("relational:remove", this.handleRemoval).off("relational:reset", this.handleReset);
            if (!collection || !(collection instanceof Backbone.Collection)) collection = new this.collectionType(null, this._getCollectionOptions());
            collection.model = this.relatedModel;
            if (this.options.collectionKey) {
                var key = this.options.collectionKey === !0 ? this.options.reverseRelation.key : this.options.collectionKey;
                collection[key] && collection[key] !== this.instance ? Backbone.Relational.showWarnings && typeof console != "undefined" && console.warn("Relation=%o; collectionKey=%s already exists on collection=%o", this, key, this.options.collectionKey) : key && (collection[key] = this.instance);
            }
            collection.on("relational:add", this.handleAddition).on("relational:remove", this.handleRemoval).on("relational:reset", this.handleReset);
            return collection;
        },
        findRelated: function(options) {
            if (this.keyContents) {
                var models = [];
                this.keyContents instanceof Backbone.Collection ? models = this.keyContents.models : _.each(this.keyContents || [], function(item) {
                    var model = null;
                    if (item instanceof this.relatedModel) model = item; else if (item || item === 0) {
                        var opts = _.defaults({
                            create: this.options.createModels
                        }, options);
                        model = this.relatedModel.findOrCreate(item, opts);
                    }
                    model && !this.related.get(model) && models.push(model);
                }, this);
                if (models.length) {
                    options = this.unsanitizeOptions(options);
                    this.related.add(models, options);
                }
            }
        },
        setKeyContents: function(keyContents) {
            this.keyContents = keyContents instanceof Backbone.Collection ? keyContents : null;
            this.keyIds = [];
            if (!this.keyContents) {
                this.keyContents = _.isArray(keyContents) ? keyContents : [ keyContents ];
                this.keyIds = _.map(this.keyContents, function(item) {
                    return Backbone.Relational.store.resolveIdForItem(this.relatedModel, item);
                }, this);
            }
        },
        onChange: function(model, attr, options) {
            options = this.sanitizeOptions(options);
            this.setKeyContents(attr);
            var related = null;
            if (this.keyContents instanceof Backbone.Collection) {
                this._prepareCollection(this.keyContents);
                related = this.keyContents;
            } else {
                var toAdd = [];
                _.each(this.keyContents, function(attributes) {
                    var model = this.relatedModel.findOrCreate(attributes, _.extend(options, {
                        create: this.options.createModels
                    }));
                    model && toAdd.push(model);
                }, this);
                this.related instanceof Backbone.Collection ? related = this.related : related = this._prepareCollection();
                related.update(toAdd, options);
            }
            this.setRelated(related);
            var dit = this;
            Backbone.Relational.eventQueue.add(function() {
                !options.silentChange && dit.instance.trigger("update:" + dit.key, dit.instance, dit.related, options);
            });
        },
        tryAddRelated: function(model, options) {
            if (!this.related.get(model)) {
                var item = _.contains(this.keyIds, model.id);
                if (item) {
                    options = this.sanitizeOptions(options);
                    this.related.add(model, options);
                }
            }
        },
        handleAddition: function(model, coll, options) {
            if (!(model instanceof Backbone.Model)) return;
            options = this.sanitizeOptions(options);
            _.each(this.getReverseRelations(model) || [], function(relation) {
                relation.addRelated(this.instance, options);
            }, this);
            var dit = this;
            Backbone.Relational.eventQueue.add(function() {
                !options.silentChange && dit.instance.trigger("add:" + dit.key, model, dit.related, options);
            });
        },
        handleRemoval: function(model, coll, options) {
            if (!(model instanceof Backbone.Model)) return;
            options = this.sanitizeOptions(options);
            _.each(this.getReverseRelations(model) || [], function(relation) {
                relation.removeRelated(this.instance, options);
            }, this);
            var dit = this;
            Backbone.Relational.eventQueue.add(function() {
                !options.silentChange && dit.instance.trigger("remove:" + dit.key, model, dit.related, options);
            });
        },
        handleReset: function(coll, options) {
            options = this.sanitizeOptions(options);
            var dit = this;
            Backbone.Relational.eventQueue.add(function() {
                !options.silentChange && dit.instance.trigger("reset:" + dit.key, dit.related, options);
            });
        },
        addRelated: function(model, options) {
            var dit = this;
            options = this.unsanitizeOptions(options);
            model.queue(function() {
                dit.related && !dit.related.get(model) && dit.related.add(model, options);
            });
        },
        removeRelated: function(model, options) {
            options = this.unsanitizeOptions(options);
            this.related.get(model) && this.related.remove(model, options);
        }
    });
    Backbone.RelationalModel = Backbone.Model.extend({
        relations: null,
        _relations: null,
        _isInitialized: !1,
        _deferProcessing: !1,
        _queue: null,
        subModelTypeAttribute: "type",
        subModelTypes: null,
        constructor: function(attributes, options) {
            var dit = this;
            if (options && options.collection) {
                this._deferProcessing = !0;
                var processQueue = function(model) {
                    if (model === dit) {
                        dit._deferProcessing = !1;
                        dit.processQueue();
                        options.collection.off("relational:add", processQueue);
                    }
                };
                options.collection.on("relational:add", processQueue);
                _.defer(function() {
                    processQueue(dit);
                });
            }
            Backbone.Relational.store.processOrphanRelations();
            this._queue = new Backbone.BlockingQueue;
            this._queue.block();
            Backbone.Relational.eventQueue.block();
            Backbone.Model.apply(this, arguments);
            Backbone.Relational.eventQueue.unblock();
        },
        trigger: function(eventName) {
            if (eventName.length > 5 && "change" === eventName.substr(0, 6)) {
                var dit = this, args = arguments;
                Backbone.Relational.eventQueue.add(function() {
                    Backbone.Model.prototype.trigger.apply(dit, args);
                });
            } else Backbone.Model.prototype.trigger.apply(this, arguments);
            return this;
        },
        initializeRelations: function() {
            this.acquire();
            this._relations = [];
            _.each(this.relations || [], function(rel) {
                Backbone.Relational.store.initializeRelation(this, rel);
            }, this);
            this._isInitialized = !0;
            this.release();
            this.processQueue();
        },
        updateRelations: function(options) {
            this._isInitialized && !this.isLocked() && _.each(this._relations || [], function(rel) {
                var val = this.attributes[rel.keySource] || this.attributes[rel.key];
                rel.related !== val && this.trigger("relational:change:" + rel.key, this, val, options || {});
            }, this);
        },
        queue: function(func) {
            this._queue.add(func);
        },
        processQueue: function() {
            this._isInitialized && !this._deferProcessing && this._queue.isBlocked() && this._queue.unblock();
        },
        getRelation: function(key) {
            return _.findWhere(this._relations, {
                key: key
            });
        },
        getRelations: function() {
            return this._relations;
        },
        fetchRelated: function(key, options, update) {
            options = _.extend({
                update: !0,
                remove: !1
            }, options);
            var setUrl, requests = [], rel = this.getRelation(key), keyContents = rel && rel.keyContents, toFetch = keyContents && _.select(_.isArray(keyContents) ? keyContents : [ keyContents ], function(item) {
                var id = Backbone.Relational.store.resolveIdForItem(rel.relatedModel, item);
                return !_.isNull(id) && (update || !Backbone.Relational.store.find(rel.relatedModel, id));
            }, this);
            if (toFetch && toFetch.length) {
                var models = _.map(toFetch, function(item) {
                    var model;
                    if (_.isObject(item)) model = rel.relatedModel.findOrCreate(item, options); else {
                        var attrs = {};
                        attrs[rel.relatedModel.prototype.idAttribute] = item;
                        model = rel.relatedModel.findOrCreate(attrs, options);
                    }
                    return model;
                }, this);
                rel.related instanceof Backbone.Collection && _.isFunction(rel.related.url) && (setUrl = rel.related.url(models));
                if (setUrl && setUrl !== rel.related.url()) {
                    var opts = _.defaults({
                        error: function() {
                            var args = arguments;
                            _.each(models || [], function(model) {
                                model.trigger("destroy", model, model.collection, options);
                                options.error && options.error.apply(model, args);
                            });
                        },
                        url: setUrl
                    }, options);
                    requests = [ rel.related.fetch(opts) ];
                } else requests = _.map(models || [], function(model) {
                    var opts = _.defaults({
                        error: function() {
                            model.trigger("destroy", model, model.collection, options);
                            options.error && options.error.apply(model, arguments);
                        }
                    }, options);
                    return model.fetch(opts);
                }, this);
            }
            return requests;
        },
        get: function(attr) {
            var originalResult = Backbone.Model.prototype.get.call(this, attr);
            if (!this.dotNotation || attr.indexOf(".") === -1) return originalResult;
            var splits = attr.split("."), result = _.reduce(splits, function(model, split) {
                if (model instanceof Backbone.Model) return Backbone.Model.prototype.get.call(model, split);
                throw new Error("Attribute must be an instanceof Backbone.Model. Is: " + model + ", currentSplit: " + split);
            }, this);
            if (originalResult !== undefined && result !== undefined) throw new Error("Ambiguous result for '" + attr + "'. direct result: " + originalResult + ", dotNotation: " + result);
            return originalResult || result;
        },
        set: function(key, value, options) {
            Backbone.Relational.eventQueue.block();
            var attributes;
            if (_.isObject(key) || key == null) {
                attributes = key;
                options = value;
            } else {
                attributes = {};
                attributes[key] = value;
            }
            var result = Backbone.Model.prototype.set.apply(this, arguments);
            if (!this._isInitialized && !this.isLocked()) {
                this.constructor.initializeModelHierarchy();
                Backbone.Relational.store.register(this);
                this.initializeRelations();
            } else attributes && this.idAttribute in attributes && Backbone.Relational.store.update(this);
            attributes && this.updateRelations(options);
            Backbone.Relational.eventQueue.unblock();
            return result;
        },
        unset: function(attribute, options) {
            Backbone.Relational.eventQueue.block();
            var result = Backbone.Model.prototype.unset.apply(this, arguments);
            this.updateRelations(options);
            Backbone.Relational.eventQueue.unblock();
            return result;
        },
        clear: function(options) {
            Backbone.Relational.eventQueue.block();
            var result = Backbone.Model.prototype.clear.apply(this, arguments);
            this.updateRelations(options);
            Backbone.Relational.eventQueue.unblock();
            return result;
        },
        clone: function() {
            var attributes = _.clone(this.attributes);
            _.isUndefined(attributes[this.idAttribute]) || (attributes[this.idAttribute] = null);
            _.each(this.getRelations() || [], function(rel) {
                delete attributes[rel.key];
            });
            return new this.constructor(attributes);
        },
        toJSON: function(options) {
            if (this.isLocked()) return this.id;
            this.acquire();
            var json = Backbone.Model.prototype.toJSON.call(this, options);
            this.constructor._superModel && !(this.constructor._subModelTypeAttribute in json) && (json[this.constructor._subModelTypeAttribute] = this.constructor._subModelTypeValue);
            _.each(this._relations || [], function(rel) {
                var value = json[rel.key];
                if (rel.options.includeInJSON === !0) value && _.isFunction(value.toJSON) ? json[rel.keyDestination] = value.toJSON(options) : json[rel.keyDestination] = null; else if (_.isString(rel.options.includeInJSON)) value instanceof Backbone.Collection ? json[rel.keyDestination] = value.pluck(rel.options.includeInJSON) : value instanceof Backbone.Model ? json[rel.keyDestination] = value.get(rel.options.includeInJSON) : json[rel.keyDestination] = null; else if (_.isArray(rel.options.includeInJSON)) {
                    var valueSub = [];
                    if (value instanceof Backbone.Collection) {
                        value.each(function(model) {
                            var curJson = {};
                            _.each(rel.options.includeInJSON, function(key) {
                                curJson[key] = model.get(key);
                            });
                            valueSub.push(curJson);
                        });
                        json[rel.keyDestination] = valueSub;
                    } else if (value instanceof Backbone.Model) {
                        _.each(rel.options.includeInJSON, function(key) {
                            valueSub[key] = value.get(key);
                        });
                        json[rel.keyDestination] = valueSub;
                    } else json[rel.keyDestination] = null;
                } else delete json[rel.key];
                rel.keyDestination !== rel.key && delete json[rel.key];
            });
            this.release();
            return json;
        }
    }, {
        setup: function(superModel) {
            this.prototype.relations = (this.prototype.relations || []).slice(0);
            this._subModels = {};
            this._superModel = null;
            this.prototype.hasOwnProperty("subModelTypes") ? Backbone.Relational.store.addSubModels(this.prototype.subModelTypes, this) : this.prototype.subModelTypes = null;
            _.each(this.prototype.relations || [], function(rel) {
                rel.model || (rel.model = this);
                if (rel.reverseRelation && rel.model === this) {
                    var preInitialize = !0;
                    if (_.isString(rel.relatedModel)) {
                        var relatedModel = Backbone.Relational.store.getObjectByName(rel.relatedModel);
                        preInitialize = relatedModel && relatedModel.prototype instanceof Backbone.RelationalModel;
                    }
                    preInitialize ? Backbone.Relational.store.initializeRelation(null, rel) : _.isString(rel.relatedModel) && Backbone.Relational.store.addOrphanRelation(rel);
                }
            }, this);
            return this;
        },
        build: function(attributes, options) {
            var model = this;
            this.initializeModelHierarchy();
            if (this._subModels && this.prototype.subModelTypeAttribute in attributes) {
                var subModelTypeAttribute = attributes[this.prototype.subModelTypeAttribute], subModelType = this._subModels[subModelTypeAttribute];
                subModelType && (model = subModelType);
            }
            return new model(attributes, options);
        },
        initializeModelHierarchy: function() {
            if (_.isUndefined(this._superModel) || _.isNull(this._superModel)) {
                Backbone.Relational.store.setupSuperModel(this);
                if (this._superModel) {
                    if (this._superModel.prototype.relations) {
                        var supermodelRelationsExist = _.any(this.prototype.relations || [], function(rel) {
                            return rel.model && rel.model !== this;
                        }, this);
                        supermodelRelationsExist || (this.prototype.relations = this._superModel.prototype.relations.concat(this.prototype.relations));
                    }
                } else this._superModel = !1;
            }
            this.prototype.subModelTypes && _.keys(this.prototype.subModelTypes).length !== _.keys(this._subModels).length && _.each(this.prototype.subModelTypes || [], function(subModelTypeName) {
                var subModelType = Backbone.Relational.store.getObjectByName(subModelTypeName);
                subModelType && subModelType.initializeModelHierarchy();
            });
        },
        findOrCreate: function(attributes, options) {
            options || (options = {});
            var parsedAttributes = _.isObject(attributes) && this.prototype.parse ? this.prototype.parse(attributes) : attributes, model = Backbone.Relational.store.find(this, parsedAttributes);
            _.isObject(attributes) && (model && options.merge !== !1 ? model.set(parsedAttributes, options) : !model && options.create !== !1 && (model = this.build(attributes, options)));
            return model;
        }
    });
    _.extend(Backbone.RelationalModel.prototype, Backbone.Semaphore);
    Backbone.Collection.prototype.__prepareModel = Backbone.Collection.prototype._prepareModel;
    Backbone.Collection.prototype._prepareModel = function(attrs, options) {
        var model;
        if (attrs instanceof Backbone.Model) {
            attrs.collection || (attrs.collection = this);
            model = attrs;
        } else {
            options || (options = {});
            options.collection = this;
            typeof this.model.findOrCreate != "undefined" ? model = this.model.findOrCreate(attrs, options) : model = new this.model(attrs, options);
            if (!model._validate(attrs, options)) {
                this.trigger("invalid", this, attrs, options);
                model = !1;
            }
        }
        return model;
    };
    var add = Backbone.Collection.prototype.__add = Backbone.Collection.prototype.add;
    Backbone.Collection.prototype.add = function(models, options) {
        if (this.model.prototype instanceof Backbone.RelationalModel) {
            models = _.isArray(models) ? models.slice() : [ models ];
            options = _.extend({
                merge: !1
            }, options);
            var newModels = [], toAdd = [];
            _.each(models, function(model) {
                model instanceof Backbone.Model || (model = Backbone.Collection.prototype._prepareModel.call(this, model, options));
                if (model) {
                    toAdd.push(model);
                    !this.get(model) && !this.get(model.cid) ? newModels.push(model) : model.id != null && (this._byId[model.id] = model);
                }
            }, this);
            add.call(this, toAdd, options);
            _.each(newModels, function(model) {
                (this.get(model) || this.get(model.cid)) && this.trigger("relational:add", model, this, options);
            }, this);
            return this;
        }
        return add.apply(this, arguments);
    };
    var remove = Backbone.Collection.prototype.__remove = Backbone.Collection.prototype.remove;
    Backbone.Collection.prototype.remove = function(models, options) {
        if (this.model.prototype instanceof Backbone.RelationalModel) {
            models = _.isArray(models) ? models.slice() : [ models ];
            options || (options = {});
            var toRemove = [];
            _.each(models, function(model) {
                model = this.get(model) || this.get(model.cid);
                model && toRemove.push(model);
            }, this);
            if (toRemove.length) {
                remove.call(this, toRemove, options);
                _.each(toRemove, function(model) {
                    this.trigger("relational:remove", model, this, options);
                }, this);
            }
            return this;
        }
        return remove.apply(this, arguments);
    };
    var reset = Backbone.Collection.prototype.__reset = Backbone.Collection.prototype.reset;
    Backbone.Collection.prototype.reset = function(models, options) {
        reset.call(this, models, options);
        this.model.prototype instanceof Backbone.RelationalModel && this.trigger("relational:reset", this, options);
        return this;
    };
    var sort = Backbone.Collection.prototype.__sort = Backbone.Collection.prototype.sort;
    Backbone.Collection.prototype.sort = function(options) {
        sort.call(this, options);
        this.model.prototype instanceof Backbone.RelationalModel && this.trigger("relational:reset", this, options);
        return this;
    };
    var trigger = Backbone.Collection.prototype.__trigger = Backbone.Collection.prototype.trigger;
    Backbone.Collection.prototype.trigger = function(eventName) {
        if (this.model.prototype instanceof Backbone.RelationalModel) {
            if (eventName === "add" || eventName === "remove" || eventName === "reset") {
                var dit = this, args = arguments;
                if (eventName === "add") {
                    args = _.toArray(args);
                    _.isObject(args[3]) && (args[3] = _.clone(args[3]));
                }
                Backbone.Relational.eventQueue.add(function() {
                    trigger.apply(dit, args);
                });
            } else trigger.apply(this, arguments);
            return this;
        }
        return trigger.apply(this, arguments);
    };
    Backbone.RelationalModel.extend = function(protoProps, classProps) {
        var child = Backbone.Model.extend.apply(this, arguments);
        child.setup(this);
        return child;
    };
})();