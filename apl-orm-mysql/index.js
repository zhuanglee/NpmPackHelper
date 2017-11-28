const Sequelize = require('sequelize');
const debug = require('debug')('orm:mysql');
const stringify = require('json-stringify-safe');
let _connected = false;


const _proxy = new Proxy({}, {
  get: function ({}, prop) {
    throw new Error('Call orm.connect before use');
  }
});

module.exports = {
  connect: function({ host, user, password, database }) {
    if (_connected) return;
    let options = arguments[0];
    this.opts = options;
    this.sequelize = new Sequelize(database, user, password, {
      host,
      dialect: options.dialect || 'mysql',
      timezone: options.dialect || '+08:00',
      logging: (sql) => {
        debug(sql);
        /*
        if (sql.indexOf('DELETE') > -1) {
          debug(sql);
        }
        */
      },
      define: {
        freezeTableName: true,
        createdAt: 'createAt',
        updatedAt: 'updateAt'
      },
      pool: { max: 5, min: 0, idle: 10000 }
    });
    Object.assign(this, {
      string: Sequelize.STRING,
      text: Sequelize.TEXT,
      integer: Sequelize.INTEGER,
      tinyint: Sequelize.INTEGER(4),
      float: Sequelize.FLOAT,
      double: Sequelize.DOUBLE,
      decimal: Sequelize.DECIMAL,
      date: Sequelize.DATE,
      enum: Sequelize.ENUM,
      col: Sequelize.col
    });

    let oldDefine = this.sequelize.define;
    let sequelize = this.sequelize;
    this.sequelize.define = (modelName, attributes, options) => {
      try {
        //  add default primary key id
        if (!options || !options.withoutId) {
          attributes = Object.assign({id: {
            type: Sequelize.INTEGER(11).UNSIGNED,
            primaryKey: true,
            autoIncrement: true 
          }}, attributes);
        } else {
          delete options.withoutId;
        }
        //  add field when attr is like *Id
        for (let key in attributes) {
          let matchArr = key.match(/^(.{1,})Id$/);
          if ( matchArr !== null) {
            let val = attributes[key];
            let valObj;
            if (val.type) {
              if (val.type instanceof Sequelize.INTEGER) {
                val.type = val.type.UNSIGNED;
              }
              valObj = val;
            } else {
              valObj = val instanceof Sequelize.INTEGER 
                ? {type: val.UNSIGNED}
                : {type: val};
            }
            valObj.field = matchArr[1] + '_id'; 
            attributes[key] = valObj;
          }
        }
//        debug(oldDefine, modelName, attributes);
        return options 
          ? oldDefine.call(sequelize, modelName, attributes, options) 
          : oldDefine.call(sequelize, modelName, attributes);
      } catch (err) {
        debug(err);
        throw new Error(`Sequelize.define Error: ${modelName}`);
      }
    }

    this.jsonType = function(field, defaultValue) {
      return {
        type: Sequelize.TEXT,
        get: function () {
          try {
            let val = this.getDataValue(field);
            return typeof val === 'string' ? JSON.parse(this.getDataValue(field) || defaultValue) : val;
          } catch (err) {
            return defaultValue;
          }
        },
        set: function (value) {
          this.setDataValue(
            field, 
            typeof value === 'object' 
              ? stringify(value) 
              : typeof value === 'string' 
                ? value 
                : defaultValue
          );
        },
      };
    };
    this.sequelize.authenticate().then(debug, debug);
  },  
  opts: _proxy,
  sequelize: _proxy,
  string: _proxy,
  text: _proxy,
  integer: _proxy,
  float: _proxy,
  double: _proxy,
  decimal: _proxy,
  date: _proxy,
  enum: _proxy,
  col: _proxy,
  jsonType: _proxy,
}
