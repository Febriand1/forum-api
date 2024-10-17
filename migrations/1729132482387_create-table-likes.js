/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      foreignKey: {
        name: 'fk_likes_user_id',
        references: 'users(id)',
      },
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      foreignKey: {
        name: 'fk_likes_comment_id',
        references: 'comments(id)',
      },
    },
  });

  pgm.addConstraint('likes', 'fk_likes_user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('likes', 'fk_likes_comment_id', {
    foreignKeys: {
      columns: 'comment_id',
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
