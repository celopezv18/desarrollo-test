<template>
	<div>
		<nav v-if="logged === true" class="navbar navbar-light bg-light">
			<a href="/" class="navbar-brand">Inicio</a>
			<a href="/usuarios" class="navbar-brand">Usuarios</a>
		</nav>
		
		<div class="container">
			<div class="row pt-5">
				<template v-if="logged === true">
				<div id="modal-productos" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-body">
							<form @submit.prevent="addProducto">
								<div class="form-group">
									<input type="text" 
									placeholder="Nombre de producto" 
									class="form-control" v-model="producto.nombre" required />
								</div>
								<div class="form-group">
									<input type="text" 
									placeholder="Tipo de producto" 
									class="form-control"  v-model="producto.tipo" required />
								</div>
								<div class="form-group">
									<input type="text" 
									placeholder="Categoría" 
									class="form-control" v-model="producto.categoria" required />
								</div>
								<div class="form-group">
									<input type="number" 
									placeholder="Stock" 
									class="form-control" v-model="producto.stock" required />
								</div>
								<template v-if="edit === false">
									<button class="btn btn-primary btn-block">Crear producto</button>
								</template>
								<template v-else>
									<button class="btn btn-primary btn-block">Guardar producto</button>
								</template>
							</form>
							</div>
							<div class="modal-footer">
							  <button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-12">
				<h2>Productos</h2>
					
					<button type="button" class="btn btn-primary mb-3 mt-5" data-toggle="modal" 
					data-target="#modal-productos">Nuevo producto</button>
					
					<table class="table table-bordered">
						<thead>
							<tr>
								<th>Producto</th>
								<th>Tipo de producto</th>
								<th>Categoría</th>
								<th>Cantidad</th>
								<th>Acción</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="prod of productos">
								<td>{{ prod.nombre }}</td>
								<td>{{ prod.tipo }}</td>
								<td>{{ prod.categoria }}</td>
								<td>{{ prod.stock }}</td>
								<td>
									<button @click="deleteProducto(prod.id)" 
									class="btn btn-danger">Eliminar</button>
									
									<button @click="editProducto(prod.id)" 
									class="btn btn-secondary" 
									data-toggle="modal" 
									data-target="#modal-productos">Editar</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				</template>
				<template v-else>
					<div class="col-md-7 center">
						<form @submit.prevent="login">
							<h4>Iniciar sesión</h4>
							<div class="form-group">
							<input type="text" placeholder="E-mail" 
							class="form-control" v-model="logueo.email" required />
							</div>
							<div class="form-group">
							<input type="password" placeholder="Contraseña" 
							class="form-control" v-model="logueo.password" required />
							</div>
							<div v-if="errorlogin === true" class="alert alert-danger">
							  E-mail o contraseña incorrectos
							</div>
							<button class="btn btn-primary btn-block">Ingresar</button>
						</form>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				logueo:{
					email: '',
					password: ''
				},
				producto:{
					id: '',
					nombre: '',
					tipo: '',
					categoria: '',
					stock: ''
				},
				productos: [
					
				],
				edit: false,
				logged: false,
				errorlogin: false
			}
		},
		created(){ //llamar al método getProductos cuando cargue la página
			this.getProductos();
		},
		methods:{
			login(){
				fetch('/login', {
					method: 'POST',
					body: JSON.stringify(this.logueo),
					headers: {
						'Accept': 'application/json',
						'Content-type': 'application/json'
					}
				})
				.then(res => res.json())
				.then(data => {
					if(data == 'error') this.errorlogin = true;
					else{
						console.log(data);
						localStorage.setItem("emailu", data);
						this.getProductos();
					}
				});
			},
			addProducto(id){ //Método para enviar los datos del formulario
				if(this.edit === false){ //si no se está editando un producto se crea uno nuevo
					fetch('/productos', {
						method: 'POST',
						body: JSON.stringify(this.producto),
						headers: {
							'Accept': 'application/json',
							'Content-type': 'application/json'
						}
					})
					.then(res => res.json()) //transformar respuesta en json
					.then(data => {
						//alert('holaa');
						console.log(data);
						this.getProductos(); //actualizar la lista de productos
					}); 
					
					this.producto.nombre='';
					this.producto.tipo='';
					this.producto.categoria='';
					this.producto.stock='';
				}else{
					fetch('/productos/' + this.producto.id, {
						method: 'PUT',
						body:JSON.stringify(this.producto),
						headers: {
							'Accept': 'application/json',
							'Content-type': 'application/json'
						}
					})
					.then(res => res.json())
					.then(data => {
						this.getProductos(); //actualizar la lista de productos
						console.log("dataedit->"+data);
					});
				}
			},
			getProductos(){ //método para listar los productos
				fetch('/productos')
				.then(res => res.json()) //transformar respuesta en json
				.then(data => {
					if(localStorage.getItem('emailu')){
						this.logged = true;
						this.productos = data;
						console.log(this.productos);
					}else{
						this.logged = false; //si no hay una sesion activa
						console.log(data);
					}
				});
			},
			deleteProducto(id){
				fetch('/productos/' + id, {
					method: 'DELETE',
					headers: {
						'Accept': 'application/json',
						'Content-type': 'application/json'
					}
				})
				.then(res => res.json()) //transformar respuesta en json
				.then(data => {
					this.getProductos(); //actualizar la lista de productos
				});
			},
			editProducto(id){ //Obtener el producto a editar
				fetch('/productos/' + id)
				.then(res => res.json())
				.then(data => {
					//llenar campos del formulario con el producto a editar
					this.producto.id = data.id;
					this.producto.nombre = data.nombre;
					this.producto.tipo = data.tipo;
					this.producto.categoria = data.categoria;
					this.producto.stock = data.stock;
					this.edit = true;
					//console.log('ladata->'+data);
				});
			}
		}
	}
</script>