export class Helpers {
    /**
     * Swallows an event to stop further execution
     * @param event
     */
    static swallowEvent(event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * Interpolates a string with vars passed to it
     * @param  {String} str   The string to interpolate
     * @param  {Object} props The params to replace in string.
     * @return {String}
     */
    static interpolate(str, props) {
        return str.replace(/\$([\w\.]+)/g, (original, key) => {
            let keys = key.split('.');
            let value = props[keys.shift()];
            while (keys.length && value !== undefined) {
                let k = keys.shift();
                value = k ? value[k] : `${value}.`;
            }
            return value !== undefined ? value : original;
        });
    }

    /**
     * Checks to see if the object is a string
     */
    static isString(obj:any) {
        return typeof obj === 'string';
    }

    /**
     * Checks to see if the object is a undefined or null
     */
    static isBlank(obj:any):boolean {
        return obj === undefined || obj === null;
    }

    /**
     * Checks to see if the object is a function
     */
    static isFunction(obj:any):boolean {
        return typeof obj === 'function';
    }

    static sortByField = (column) => {
        return (previous, current) => {
            //return (a[field] < b[field]) ? -1 : (a[field] > b[field]) ? 1 : 0; // eslint-disable-line
            const field = column.name;
            let first = previous[field] || '';
            let second = current[field] || '';

            // Custom compare function on the column
            // if (column.compare && Helpers.isFunction(column.compare)) {
            //     return column.compare(column.sort, first, second);
            // }

            if (Helpers.isString(first) && Helpers.isString(second)) {
                // Basic strings
                first = first.toLowerCase();
                second = second.toLowerCase();
            } else {
                // Numbers
                first = isNaN(Number(first)) ? first : Number(first);
                second = isNaN(Number(second)) ? second : Number(second);
            }

            if (first > second) {
                return column.sort === 'desc' ? -1 : 1;
            }
            if (first < second) {
                return column.sort === 'asc' ? -1 : 1;
            }
            return 0;
        };
    }

    static filterByField = (key, value) => {
        //TODO: Handle dates, min, max, options, etc...
        return (item) => {
            //return item[field] === options.value;
            let results = [];
            let field = can(item).have(key);
            if (Array.isArray(value)) {
                results.push(value.includes(field));
            } else if (value instanceof Object) {
                if (value.min) {
                    results.push(field > value.min);
                }
                if (value.max) {
                    results.push(field < value.max);
                }
                if (value.any && value.any instanceof Array) {
                    results.push(value.any.some(v => field.includes(v)));
                }
                if (value.all && value.all instanceof Array) {
                    results.push(value.all.every(v => field.includes(v)));
                }
                if (value.not) {
                    results.push(!Helpers.filterByField(key, value.not)(item));
                }
                for (let subkey in value) {
                    if (['min', 'max', 'any', 'all', 'not'].indexOf(subkey) < 0) {
                        let subvalue = value[subkey];
                        results.push(Helpers.filterByField(`${key}.${subkey}`, subvalue)(item));
                    }
                }
            } else {
                results.push(field.match(new RegExp(value, 'gi')));
            }

            return results.every(x => x);
        };
    }
}
class Can {
    constructor(obj) {
        this.obj = obj;
    }

    have(key) {
        let props = key.split('.');
        let item = this.obj;
        for (let i = 0; i < props.length; i++) {
            item = item[props[i]];
            if (this.check(item) === false) {
                return item;
            }
        }
        return item;
    }

    check(thing) {
        return thing !== void 0;
    }
}

function can(obj) {
	    return new Can(obj);
}
