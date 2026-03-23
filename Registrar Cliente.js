const db = require("../models/db");


// Crear Cliente
exports.crearCliente = (req, res) => {

    const { nombre, apellido, correo, telefono, direccion } = req.body;

    const sql = `
        INSERT INTO clientes 
        (nombre, apellido, correo, telefono, direccion)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [nombre, apellido, correo, telefono, direccion], (err, result) => {

        if (err) return res.status(500).json(err);

        res.json({
            mensaje: "Cliente registrado",
            id: result.insertId
        });
    });
};


// Obtener Cliente
exports.obtenerClientes = (req, res) => {

    db.query("SELECT * FROM clientes", (err, result) => {

        if (err) return res.status(500).json(err);

        res.json(result);
    });
};


// Obtener Cliente Por ID
exports.obtenerCliente = (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM clientes WHERE id = ?",
        [id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json(result[0]);
        }
    );
};


// Actualizar Cliente
exports.actualizarCliente = (req, res) => {

    const id = req.params.id;
    const { nombre, apellido, correo, telefono, direccion } = req.body;

    const sql = `
        UPDATE clientes 
        SET nombre=?, apellido=?, correo=?, telefono=?, direccion=?
        WHERE id=?
    `;

    db.query(sql,
        [nombre, apellido, correo, telefono, direccion, id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({ mensaje: "Cliente actualizado" });
        });
};


// Eliminar Cliente
exports.eliminarCliente = (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM clientes WHERE id = ?",
        [id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({ mensaje: "Cliente eliminado" });
        }
    );
};