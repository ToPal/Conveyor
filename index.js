"use strict";

var Conveyor = function(processor, params, afterStopFunction) {
    if ((processor === undefined) || (!(processor instanceof Function))) {
        throw new Error('Conveyor needs a correct processor function');
    }
    params = params || {};

    this.processor = processor;
    this.period = params.period || 1000;
    this.useQueue = params.useQueue || false;
    this.expectedElementsCounter = params.expectedElementsCount || 0;

    this.elementsForProcessing = [];
    this.processing = false;
    this._afterStopFunction = afterStopFunction || undefined;
};


Conveyor.prototype = {

    add: function (elems) {
        if (!(elems instanceof Array)) {
            elems = [elems];
        }

        this.elementsForProcessing = this.elementsForProcessing.concat(elems);
        this.unwait();

        this._process();
    },

    _process: function () {
        if (this.processing) return 0; // elements are already in processing

        this.processing = true;

        if (this.useQueue) {
            this._processNext();
        } else {
            this._processAll();
        }
    },

    _processNext: function() {
        var that = this;
        setTimeout(function() {
            if (that.elementsForProcessing.length === 0) {
                if (that.isWaiting()) return;

                that._stopProcessing();
                return 0;
            }

            var currentElement = that.elementsForProcessing.shift();
            that.processor(currentElement, function() {
                that._processNext();
            });
        }, this.period);
    },

    _processAll: function() {
        var that = this;
        this.timerId = setInterval(function () {
            if (that.elementsForProcessing.length === 0) {
                if (that.isWaiting()) return;

                clearInterval(that.timerId);

                that._stopProcessing();
                return 0;
            }

            var currentElement = that.elementsForProcessing.shift();
            that.processor(currentElement);
        }, this.period);
    },

    _stopProcessing: function() {
        if (this.processing == false) return;

        if (this._afterStopFunction !== undefined) {
            this._afterStopFunction();
        }

        this.processing = false;
    },

    whenStop: function (afterStopFunction) {
        if ((afterStopFunction === undefined) || (!(afterStopFunction instanceof Function))) {
            throw new Error('afterStopFunction should be a correct function');
        }

        this._afterStopFunction = afterStopFunction;

        if ((this.processing == false) && (!this.isWaiting())) {
            return afterStopFunction();
        }
    },

    forceStop: function () {
        this.expectedElementsCounter = 0;
        this.processing = true;
        this._stopProcessing();
    },

    wait: function (count) {
        count = count || 1;
        this.expectedElementsCounter += count;
    },

    unwait: function (count) {
        if (this.expectedElementsCounter == 0) {
            return 0;
        }

        count = count || 1;
        this.expectedElementsCounter -= count;
        if (this.expectedElementsCounter < 0) this.expectedElementsCounter = 0;

        if ((this.expectedElementsCounter == 0) &&
            (this._afterStopFunction !== undefined)) {
            this._process();
        }
    },

    isWaiting: function () {
        return (this.expectedElementsCounter > 0);
    }
};

module.exports = Conveyor;