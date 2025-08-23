const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const SECRET = 'clave123';

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({ error: `El nombre de usuario "${username}" ya está en uso` });
    }
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ error: `El correo "${email}" ya está registrado` });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password_hash });
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ error: 'Error al registrar usuario', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username, role: user.role }, SECRET, { expiresIn: '2h' });
    res.json({ message: 'Login exitoso', 
      token , 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'created_at']
    });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        role: "user"
    } });
    res.json({ user });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { search } = req.query;
    console.log(search);
    if (!search) {
      return res.status(400).json({ error: 'Debe proporcionar un parámetro de búsqueda' });
    }
    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${search}%`
        },
        role: "user"
      },
      attributes: ['id', 'username', 'email', 'role', 'created_at']
    });
    res.json({ users });
  } catch (error) {
    console.error('Error al buscar usuario:', error);
    res.status(500).json({ error: 'Error al buscar usuario', details: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    // Verificar si el usuario existe
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (username) {
      const usernameExists = await User.findOne({
        where: {
          username,
          id: { [Op.ne]: id } // distinto id
        }
      });
      if (usernameExists) {
        return res.status(400).json({ error: `El nombre de usuario "${username}" ya está en uso` });
      }
    }

    if (email) {
      const emailExists = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: id } // distinto id
        }
      });
      if (emailExists) {
        return res.status(400).json({ error: `El correo "${email}" ya está registrado` });
      }
    }

    let password_hash = user.password_hash;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      password_hash,
      role: role || user.role
    });

    res.json({
      message: 'Usuario actualizado con éxito',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
  }
};

exports.countUsers = async (req, res) => {
  try {
    const totalUsers = await User.count({
      where: { role: "user" }
    });

    res.json({ totalUsers });
  } catch (error) {
    console.error('Error al contar usuarios:', error);
    res.status(500).json({ error: 'Error al contar usuarios', details: error.message });
  }
};



