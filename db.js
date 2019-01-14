// Database "imageboard"
const spicedPg = require("spiced-pg");
// const secrets = require("./secrets");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

// exports.createPetition = (signature, user_id) => {
//     return db.query(
//         `INSERT INTO petition (signature, user_id)
//         VALUES ($1, $2)
//         RETURNING *`,
//         [signature || null, user_id || null] // [first, last, sig] you need to use the ${1}... and an array to inject user input data -> Otherwise you can be attached by executable code (SQL injection attack)
//     );
// };

exports.getImages = () => {
    return db.query(`SELECT * FROM images
        ORDER BY id DESC
        LIMIT 1`);
};

exports.uploadImages = (url, description, title, username) => {
    return db.query(
        `INSERT INTO images (url, description, title, username)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
        [url, description, title, username]
    );
};

exports.updateCompletion = (id, status) => {
    return db.query(
        `INSERT INTO images (status)
        VALUES $2
        WHERE id = $1
        RETURNING *`,
        [id, status]
    );
};

exports.getImageById = id => {
    return db.query(
        `SELECT images.id AS imageId, url, images.username, title, description, images.created_at, comments.comment, comments.username AS usernametwo, comments.created_at AS commenttime
        FROM images
        LEFT JOIN comments
        ON images.id = comments.imageid
        WHERE images.id = $1
        ORDER BY comments.id DESC`,
        [id]
    );
};

// exports.getImageId = id => {
//     return db.query(
//         `SELECT i.id AS imageId, url, i.username AS username, title, description, i.created_at AS created_at, comment, c.username AS commentUser
//         FROM images AS i
//         LEFT JOIN comments AS c
//         ON i.id = c.image_id
//         WHERE i.id = $1`,
//         [id]
//     );

exports.uploadComments = (comment, username, imageId) => {
    return db.query(
        `INSERT INTO comments (comment, username, imageId)
    VALUES ($1, $2, $3)
    RETURNING comment, username AS usernametwo, created_at AS commenttime`,
        [comment, username, imageId]
    );
};

exports.getMoreImages = lastId => {
    // including a subquery, see syntax ",()"

    return db
        .query(
            `SELECT *,(
            SELECT id FROM images WHERE id =1
        ) AS last_id

        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 1`,
            [lastId]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getCompletion = () => {
    return db.query(
        `SELECT *
        FROM images`
    );
};

//
// exports.getCity = city => {
//     return db.query(
//         `SELECT users.firstname, users.lastname, user_profiles.age, user_profiles.url
//     FROM petition
//     LEFT JOIN user_profiles
//     ON user_profiles.user_id = petition.user_id
//     LEFT JOIN users
//     ON users.id = petition.user_id
//     WHERE city = $1`,
//         [city]
//     );
// };

// exports.createPetition = (signature, user_id) => {
//     return db.query(
//         `INSERT INTO petition (signature, user_id)
//         VALUES ($1, $2)
//         RETURNING *`,
//         [signature || null, user_id || null] // [first, last, sig] you need to use the ${1}... and an array to inject user input data -> Otherwise you can be attached by executable code (SQL injection attack)
//     );
// };
