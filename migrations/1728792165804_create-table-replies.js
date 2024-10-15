/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('replies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            foreignKey: {
                name: 'fk_replies_comment_id',
                references: 'comments(id)',
            },
        },
        owner: {
            type: 'VARCHAR(50)',
            foreignKey: {
                name: 'fk_replies_owner',
                references: 'users(id)',
            },
        },
        created_at: {
            type: 'TIMESTAMPTZ',
            default: pgm.func('current_timestamp'),
        },
        is_delete: {
            type: 'BOOLEAN',
            notNull: true,
            default: false,
        },
    });

    pgm.addConstraint('replies', 'fk_replies_comment_id', {
        foreignKeys: {
            columns: 'comment_id',
            references: 'comments(id)',
            onDelete: 'CASCADE',
        },
    });

    pgm.addConstraint('replies', 'fk_replies_owner', {
        foreignKeys: {
            columns: 'owner',
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('replies');
};
