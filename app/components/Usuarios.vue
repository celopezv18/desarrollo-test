<template>
	<div>
		<nav class="navbar navbar-light bg-light">
			<a href="/" class="navbar-brand">Inicio</a>
			<a href="/usuarios" class="navbar-brand">Usuarios</a>
		</nav>
		
		<div class="container">
			<div class="row pt-5">
				<div class="col-md-5">
					<div class="card">
						<div class="card-body">
							<h3>Crear nuevo usuario</h3>
							<form @submit.prevent="addUsuario">
								<div class="form-group">
									<input type="text" 
									placeholder="Nombre" 
									required 
									class="form-control" v-model="usuario.nombre" />
								</div>
								<div class="form-group">
									<input type="email" 
									placeholder="E-mail" 
									required 
									class="form-control"  v-model="usuario.email" />
								</div>
								<div class="form-group">
									<input type="password" 
									placeholder="Contraseña" 
									required 
									class="form-control" v-model="usuario.password" />
								</div>
								<div class="form-group">
									<input type="password" 
									placeholder="Confirmar contraseña" 
									required 
									class="form-control" v-model="usuario.password2" />
								</div>
								<template v-if="edit === false">
									<button class="btn btn-primary btn-block">Crear usuario</button>
								</template>
								<template v-else>
									<button class="btn btn-primary btn-block">Guardar datos</button>
									<button type="button" @click="canceleditUser()" 
									class="btn btn-danger btn-block">Cancelar</button>
								</template>
							</form>
						</div>
					</div>
				</div>
				<div class="col-md-7">
					<table class="table table-bordered">
						<thead>
							<tr>
								<th>Nombre</th>
								<th>E-mail</th>
								<th>Acción</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="user of usuarios">
								<td>{{ user.nombre }}</td>
								<td>{{ user.email }}</td>
								<td>
									<button @click="deleteUser(user.id)" 
									class="btn btn-danger">Eliminar</button>
									
									<button @click="editUser(user.id)" 
									class="btn btn-secondary">Editar</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				usuario:{
					id: '',
					nombre: '',
					email: '',
					password: '',
					password2: ''
				},
				usuarios: [
					
				],
				edit: false
			}
		},
		created(){ //llamar al método getusuarios cuando cargue la página
			this.getusuarios();
		},
		methods:{
			addUsuario(id){ //Método para enviar los datos del formulario
				if(this.edit === false){ //si no se está editando un usuario se crea uno nuevo
					if(this.usuario.password==this.usuario.password2){
						fetch('/usuarios', {
							method: 'POST',
							body: JSON.stringify(this.usuario),
							headers: {
								'Accept': 'application/json',
								'Content-type': 'application/json'
							}
						})
						.then(res => res.json()) //transformar respuesta en json
						.then(data => {
							//alert('holaa');
							console.log(data);
							this.getusuarios(); //actualizar la lista de usuarios
						}); 
						
						this.usuario.nombre='';
						this.usuario.email='';
						this.usuario.password='';
						this.usuario.password2='';
					}else alert('La contraseña debe coincidir');
				}else{
					fetch('/usuarios/' + this.usuario.id, {
						method: 'PUT',
						body:JSON.stringify(this.usuario),
						headers: {
							'Accept': 'application/json',
							'Content-type': 'application/json'
						}
					})
					.then(res => res.json())
					.then(data => {
						this.getusuarios(); //actualizar la lista de usuarios
						console.log("dataedit->"+data);
					});
				}
			},
			getusuarios(){ //método para listar los usuarios
				fetch('/usuarios/list', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-type': 'application/json'
					}
				})
				.then(res => res.json()) //transformar respuesta en json
				.then(data => {
					this.usuarios = data; //actualizar la lista de usuarios
					console.log(data);
				});
			},
			deleteUser(id){
				fetch('/usuarios/' + id, {
					method: 'DELETE',
					headers: {
						'Accept': 'application/json',
						'Content-type': 'application/json'
					}
				})
				.then(res => res.json()) //transformar respuesta en json
				.then(data => {
					this.getusuarios(); //actualizar la lista de usuarios
				});
			},
			editUser(id){ //Obtener el usuario a editar
				fetch('/usuarios/' + id)
				.then(res => res.json())
				.then(data => {
					//llenar campos del formulario con el usuario a editar
					this.usuario.id = data.id;
					this.usuario.nombre = data.nombre;
					this.usuario.email = data.email;
					this.edit = true;
					//console.log('ladata->'+data);
				});
			},
			canceleditUser(){
				this.edit = false;
				this.usuario.nombre='';
				this.usuario.email='';
				this.usuario.password='';
				this.usuario.password2='';
				return false;
			}
		}
	}
</script>