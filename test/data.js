/**
 * Created by JohnMak on 29/10/15.
 */


module.exports = {
    server_url: 'http://localhost:3000',
    test_user: {
        username: "test_user",
        password: "1q2w",
        is_admin: false
    },
    test_user_updated: {
        username: "test_user",
        password: "1q2w3e4r",
        is_admin: false
    },
    test_user_two: {
        username: "test_user_two",
        password: "1q2w",
        is_admin: false
    },
    test_admin: {
        username: "test_admin",
        password: "1q2w",
        is_admin: true
    },
    test_admin_updated: {
        username: "test_admin",
        password: "1q2w3e4r",
        is_admin: true
    },

    test_timezones: [
        {
            title: 'Great Britain',
            city: 'London',
            utc_offset: 0
        },
        {
            title: 'Red Alert',
            city: 'Moscow',
            utc_offset: 3
        },
        {
            title: 'New World',
            city: 'New York',
            utc_offset: -5
        }
    ]

};
