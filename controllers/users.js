const User = require('../models/user');

module.exports.showRegisterPage = (req, res) => {
    if (!req.user) {
        res.render('users/register')
    } else {
        res.redirect('/')
    }

}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'You have been succesfully registered')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.showLoginPage = (req, res) => {
    if (!req.user) {
        res.render('users/login');
    } else {
        res.redirect('/')
    }

}

module.exports.login = (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome ${username}!`);
    req.flash('error')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}