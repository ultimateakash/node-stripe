const { isEmpty } = require("lodash");

module.exports = (hbs) => {
    
    hbs.registerHelper('section', function(name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    });
    
    hbs.registerHelper('notEmpty', function(value) {
        return !isEmpty(value) || null;
    });

    hbs.registerHelper('inc', function(value) {
        return parseInt(value) + 1;
    });
}