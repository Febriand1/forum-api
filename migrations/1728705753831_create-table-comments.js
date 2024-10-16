/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            foreignKey: {
                name: 'fk_comments_thread_id',
                references: 'threads(id)',
            },
        },
        created_at: {
            type: 'TIMESTAMPTZ',
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addConstraint('comments', 'fk_comments_thread_id', {
        foreignKeys: {
            columns: 'thread_id',
            references: 'threads(id)',
            onDelete: 'CASCADE',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('comments');
};
