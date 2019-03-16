'use strict';
module.exports = (sequelize, DataTypes) => {
  const TodoItem = sequelize.define(
    'TodoItem',
    {
      description: DataTypes.STRING
    },
    {}
  );
  TodoItem.associate = function(models) {
    // associations can be defined here
    TodoItem.belongsTo(models.Todo, {
      foreignKey: 'todoId',
      onDelete: 'CASCADE'
    });
  };
  return TodoItem;
};
