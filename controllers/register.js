
const handleRegister = (req, res, knex, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password)
        return res.status(400).json('Incorrect form submission');
    const hash = bcrypt.hashSync(password);
    /***** Transaction starts */
    knex.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return (trx('users')
                    .insert({
                        name: name,
                        email: loginEmail[0].email,
                        joined: new Date
                    }, '*')
                    .then(user => {
                        res.json(user[0]);
                    })
            )
        })
        /***** Transaction ends */
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'));
}

module.exports = {
    handleRegister: handleRegister
};