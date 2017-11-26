const moment = require('moment');

module.exports = {
    section: function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    },
    categoryList: function(user, cat){
      if (user.certifications.cateogry == cat) {
        console.log(user.certifications);
        return `user.certifications`
      }
    },
    formatDate: function(date, format){
        return moment(date).format(format);
    }
}
