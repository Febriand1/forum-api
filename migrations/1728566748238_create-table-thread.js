/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        body: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            foreignKey: { name: 'fk_threads_owner', references: 'users(id)' },
        },
        created_at: {
            type: 'TIMESTAMPTZ',
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addConstraint('threads', 'fk_threads_owner', {
        foreignKeys: {
            columns: 'owner',
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('threads');
};
