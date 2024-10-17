/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumns('comments', {
    owner: {
      type: 'VARCHAR(50)',
      foreignKey: { name: 'fk_comments_owner', references: 'users(id)' },
    },
  });

  pgm.addConstraint('comments', 'fk_comments_owner', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('comments', 'owner');
};
