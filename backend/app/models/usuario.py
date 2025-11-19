from .permiso import Permiso

class Usuario:
    def __init__(self, id_usuario: int, user_name: str, password: str, permiso: Permiso):
        self.id_usuario = id_usuario
        self.user_name = user_name
        self.password = password
        self.permiso = permiso

    @property
    def id_usuario(self):
        return self._id_usuario

    @id_usuario.setter
    def id_usuario(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de usuario debe ser un entero positivo')
        self._id_usuario = value

    @property
    def user_name(self):
        return self._user_name

    @user_name.setter
    def user_name(self, value):
        self._user_name = value

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        # En un sistema real, aquí se debería hashear la contraseña
        self._password = value

    @property
    def permiso(self):
        return self._permiso

    @permiso.setter
    def permiso(self, value):
        if not isinstance(value, Permiso):
            raise ValueError('permiso debe ser una instancia de la clase Permiso')
        self._permiso = value