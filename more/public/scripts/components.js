const background = makeElement('img',{
	src:'/file?fn=background-5964794_1920.jpg',
	style:`
		width:100%;
		height:100%;
		object-fit:cover;
		position:relative;
	`,
})

const topthings = makeElement('div',{
	style:`
		position:absolute;
	`,
	onadded(){
		this.addChild(header);
		this.addChild(content);
	}
})

const header = makeElement('header',{
	style:`
		margin-bottom:100px;
	`,
	storageref:firebase.storage().ref(),
	productsref:firebase.database().ref('products'),
	newProductsRef(string){
		return firebase.database().ref(`products/${string}`);
	},
	innerHTML:`
		<div
		style="
			text-align:center;
			margin-bottom:5px;
		"
		>
			<img src=/file?fn=goodicon.png
			style="
				width:120px;
				height:120px;
				background:#ff89b93d;
				padding:10px;
				border-radius:50%;
				object-fit:cover;
			"
			>
		</div>
		<div
		style="
			text-align:center;
		"
		>
			<span
			style="
				font-weight:bold;
				color:white;
				font-size:40px;
				padding:0 5px;
			"
			>
				AKARA
			</span>
		</div>
		<div
		style="
			text-align:center;
			margin-bottom:5px;
		"
		>
			<span
			style="
				color:white;
				padding:0 5px;
			"
			>Selalu melayani dengan sepenuh hati!</span>
		</div>
	`
})

const content = makeElement('content',{
	style:`
	`,
	innerHTML:`
		<div
		style="
			display:flex;
			justify-content:space-around;
			color:white;
		"
		>
			<div id=new
			style="
				margin-right:25px;
			"
			>
				<span class=akarabutton>
					Buat Pesanan
				</span>
			</div>
			<div id=check
			style="
				margin-left:25px;
			"
			>
				<span class=akarabutton>
					Cek Pesanan
				</span>
			</div>
		</div>
	`,
	buttonEventSetup(){
		const events = {
			content:this,
			new(){
				find('main').addChild(makeElement('div',{
					style:`
						position:absolute;
						top:0;
						left:0;
						width:100%;
						height:100%;
						background:#0000004f;
						display:flex;
						justify-content:center;
						align-items:center;
					`,
					innerHTML:`
						<div
						id=whitebox
						style="
							background:white;
							padding:30px;
							border-radius:10px;
							height:60%;
						"
						>
							<div
							style="
								height:10%;
								margin-bottom:10px;
							"
							>
								<span>Buat Pesanan</span>
							</div>
							<div
							style="
								height:80%;
								overflow:auto;
								scrollbar-width:thin;
							"
							>
								<div
								style="
									margin-bottom:5px;
								"
								>
									<div>
										<span>Nama</span>
									</div>
									<input placeholder=Gema...
									style="
										background:#d7d3d370;
									"
									id=name
									>
								</div>
								<div
								style="
									margin-bottom:5px;
								"
								>
									<div>
										<span>WA</span>
									</div>
									<input placeholder="No Whatsapp anda..." type=number
									style="
										background:#d7d3d370;
									"
									id=whoarei
									>
								</div>
								<div
								style="
									margin-bottom:5px;
								"
								>
									<div>
										<span>Nama Barang</span>
									</div>
									<input placeholder="Tuliskan Nama Barang"
									style="
										background:#d7d3d370;
									"
									id=stuffname
									>
								</div>
								<div
								style="
									margin-bottom:5px;
								"
								>
									<div>
										<span>Kendala</span>
									</div>
									<input placeholder="Paparkan Jenis Kerusakan"
									style="
										background:#d7d3d370;
									"
									id=typeofbroken
									>
								</div>
								<div
								style="
									margin-bottom:5px;
									display:flex;
									flex-direction:column;
								"
								>
									<div>
										<span>Catatan</span>
									</div>
									<textarea placeholder="Pesan Dari Anda..."
									style="
										background:#d7d3d370;
										border:none;
										width:95%;
										outline:none;
										max-width:92%;
										padding:10px;
										max-height:200px;
									"
									id=notes
									></textarea>
								</div>
								<div
								style="
									margin-bottom:5px;
									display:flex;
									flex-direction:column;
								"
								>
									<div>
										<span>Foto Barang (WAJIB)</span>
									</div>
									<input type=file multiple
									id=files>
								</div>
							</div>
							<div
							style="
								display:flex;
								align-items:center;
								justify-content:flex-end;
								height:10%;
							"
							id=buttons
							>
								<div
								id=save
								style="
									margin-right:20px;
								"
								>
									<span class=akarabutton>Pesan</span>
								</div>
								<div
								id=cancel
								>
									<span class=akarabutton>Batal</span>
								</div>
							</div>
						</div>
					`,
					onadded(){
						this.eventSetup();
					},
					eventSetup(){
						const events = {
							el:this,
							cancel(){
								this.el.remove();
							},
							save(){
								const files = this.el.find('#files').files;
								const data = {
									name:this.el.find('#name').value,
									whoarei:this.el.find('#whoarei').value,
									notes:this.el.find('#notes').value,
									status:0,
									typeofbroken:this.el.find('#typeofbroken').value,
									stuffname:this.el.find('#stuffname').value
								};
								console.log(data.time);
								//make some function to validate the value of data.
								//the scenario is simple.
								//upload all files. then send the data.
								uploadFiles(files,(src)=>{
									data.fileSrc = src;
									//time to send data to db.
									const productID = `products-${getUniqueID(5)}`;
									console.log(productID);
									const products = header.newProductsRef(productID);
									products.set(data).then(()=>{
										this.el.remove();
										loadingProcess.remove();
										newProductSPops(productID);
									})
								})
								//giving the indicator page.
								const loadingProcess = makeElement('div',{
									style:`
										display:flex;
										position:absolute;
										top:0;
										left:0;
										width:100%;
										height:100%;
										background:#0000004f;
										justify-content:center;
										align-items:center;
									`,
									innerHTML:`
										<div
										style="
											background:white;
											padding:20px;
											display:flex;
											flex-direction:column;
											align-items:center;
											justify-content:center;
										"
										>
											<div>
												<span>Memproses Pesanan Anda!</span>
											</div>
											<div>
												<img src=/file?fn=loadingscreen.gif
												style="
													width:100px;
													height:100px;
													object-fit:cover;
												"
												>
											</div>
										</div>
									`
								});
								find('main').addChild(loadingProcess);
							}
						}
						this.findall('#buttons span').forEach(button=>{
							button.onclick = ()=>{
								events[button.parentNode.id]()
							}
						})
					}
				}));
			},
			check(){
				find('main').addChild(makeElement('div',{
					style:`
						position:absolute;
						top:0;
						left:0;
						width:100%;
						height:100%;
						background:#0000004f;
						display:flex;
						justify-content:center;
						align-items:center;
					`,
					innerHTML:`
						<div
						id=whitebox
						style="
							background:white;
							padding:30px;
							max-height:60%;
						"
						>
							<div
							style="
								margin-bottom:20px;
							"
							>
								<span
								style="
									font-weight:bold;
								"
								>Masukan ID Pesanan Anda!</span>
							</div>
							<div
							style="
								display:flex;
								justify-content:space-between;
								align-items:center;
								margin-bottom:30px;
							"
							>
								<div
								style="
									width:80%;
								"
								>
									<input placeholder="Id Pesanan"
									style="
										background:#d7d3d370;
										padding-top:10px;
										padding-bottom:10px;
										width:98%;
									"
									>
								</div>
								<div
								style="
									width:15%;
								"
								class=button id=load
								>
									<span class=akarabutton>Load</span>
								</div>
							</div>
							<div
							style="
								display:flex;
								justify-content:flex-start;
								align-items:center;
							"
							>
								<div class=button id=process
								style="
									margin-right:10px;
								"
								>
									<span class=akarabutton>Cek</span>
								</div>
								<div class=button id=cancel>
									<span class=akarabutton>Tutup</span>
								</div>
							</div>
							<div id=info
								
							</div>
						</div>
					`,
					onadded(){
						this.eventSetup();
					},
					eventSetup(){
						const eventClick = {
							el:this,
							load(){
								//gonna load the data ID from ls.
								const data = localStorage.getItem('newestID');
								if(data){
									this.el.find('input').value = data;
								}
							},
							process(){
								const id = this.el.find('input').value===''?'nope':this.el.find('input').value;
								getInfo(this.el,id);
							},
							cancel(){
								this.el.remove();
							}
						}
						this.findall('.button span').forEach(button=>{
							button.onclick = ()=>{
								eventClick[button.parentNode.id]();
							}
						})
					}
				}));
			}
		}
		this.findall('div span').forEach(button=>{
			button.onclick = ()=>{events[button.parentNode.id]()}
		})
	},
	onadded(){
		this.buttonEventSetup();
	}
})

const getInfo = function(el,id){
	const product = header.newProductsRef(id);
	product.get().then(data=>{
		data = data.val();
		setTimeout(()=>{
			loadingProcess.remove();
			el.find('#info').clear();
			if(!data){
				el.find('#info').setHTML(`
					<div
					style="
						margin-top:30px;
					"
					>
						<span
						style="color:red"
						>ID Tidak Valid.</span>
					</div>
				`);
			}else el.find('#info').addChild(makeElement('div',{
				style:`
					margin-top:20px;
					font-weight:normal;
					padding:5px;
					background:#efefef;
					font-family:calibri;
				`,
				innerHTML:`
					<div
					style="
						margin-bottom:10px;
					"
					>Data untuk ${id}.</div>
					<div
					style="
						display:flex;
						justify-content:space-between;
						align-items:center;
					"
					>
						<div
						style="
							width:50%;
						"
						>
							<span>Nama</span>
						</div>
						<div
						style="
							width:50%;
						">
							<span>${data.name}</span>
						</div>
					</div>
					<div
					style="
						display:flex;
						justify-content:space-between;
						align-items:center;
					">
						<div
						style="
							width:50%;
						">
							<span>WA</span>
						</div>
						<div
						style="
							width:50%;
						">
							<span>${data.whoarei}</span>
						</div>
					</div>
					<div
					style="
						display:flex;
						justify-content:space-between;
						align-items:center;
					">
						<div
						style="
							width:50%;
						">
							<span>Nama Barang</span>
						</div>
						<div
						style="
							width:50%;
						">
							<span>${data.stuffname}</span>
						</div>
					</div>
					<div
					style="
						display:flex;
						justify-content:space-between;
						align-items:center;
					">
						<div
						style="
							width:50%;
						">
							<span>Kendala</span>
						</div>
						<div
						style="
							width:50%;
						">
							<span>${data.typeofbroken}</span>
						</div>
					</div>
					<div
					style="
						display:flex;
						justify-content:space-between;
						align-items:center;
					">
						<div
						style="
							width:50%;
						">
							<span>DeadLine</span>
						</div>
						<div
						style="
							width:50%;
						">
							<span>${data.deadline||'No Data'}</span>
						</div>
					</div>
					<div
					style="
						display:flex;
						justify-content:space-between;
						align-items:center;
					">
						<div
						style="
							width:50%;
						">
							<span>Catatan</span>
						</div>
						<div
						style="
							width:50%;
						">
							<span>${data.notes}</span>
						</div>
					</div>
					<div
					style="
						display:flex;
						justify-content:space-between;
						align-items:center;
					">
						<div
						style="
							width:50%;
						">
							<span>Status</span>
						</div>
						<div
						style="
							width:50%;
						">
							<span>${data.status===0?'ORDER':data.status===1?'PENDING':'DONE'}</span>
						</div>
					</div>
					<div
					style="
						display:${!data.cost?'none':'flex'};
						justify-content:space-between;
						align-items:center;
					">
						<div
						style="
							width:50%;
						">
							<span>Harga Tagihan</span>
						</div>
						<div
						style="
							width:50%;
						">
							<span>RP. ${data.cost}</span>
						</div>
					</div>
					<div
					style="
						display:${!data.adminnotes?'none':'flex'};
						justify-content:space-between;
						align-items:center;
					">
						<div
						style="
							width:50%;
						">
							<span>Catatan Admin</span>
						</div>
						<div
						style="
							width:50%;
						">
							<span>${data.adminnotes}</span>
						</div>
					</div>
					
				`
			}))
		},500)
	})
	const loadingProcess = makeElement('div',{
		style:`
			display:flex;
			position:absolute;
			top:0;
			left:0;
			width:100%;
			height:100%;
			background:#0000004f;
			justify-content:center;
			align-items:center;
		`,
		innerHTML:`
			<div
			style="
				background:white;
				padding:20px;
				display:flex;
				flex-direction:column;
				align-items:center;
				justify-content:center;
			"
			>
				<div>
					<span>Memuat Info!</span>
				</div>
				<div>
					<img src=/file?fn=loadingscreen.gif
					style="
						width:100px;
						height:100px;
						object-fit:cover;
					"
					>
				</div>
			</div>
		`
	});
	find('main').addChild(loadingProcess);
}

const newProductSPops = function(pid){
	find('main').addChild(makeElement('div',{
		style:`
			position:absolute;
			top:0;
			left:0;
			width:100%;
			height:100%;
			background:#0000004f;
			display:flex;
			align-items:center;
			justify-content:center;
		`,
		innerHTML:`
			<div
			style="
				background:white;
				padding:20px;
			"
			>
				<div>
					<div
					style="
						margin-bottom:10px;
						font-size:20px;
						font-weight:bold;
					"
					>
						<span>Pesanan Berhasil DiBuat!</span>
					</div>
					<div>
						<span>ID Pesananmu!</span>
					</div>
					<div
					style="
						display:flex;
						align-items:center;
						justify-content:space-between;
						background:#f3f3f3;
						padding:5px;
					"
					>
						<span
						style="
							font-weight:bold;
							text-decoration:underline;
						"
						>${pid}</span>
						<img src=/file?fn=copy.png
						style="
							width:16px;
							height:16px;
							cursor:pointer;
						"
						>
					</div>
				</div>
				<div id=notifyclip>
					<span
					style="
						font-size:12px;
						color:red;
					"
					></span>
				</div>
				<div
				style="
					margin-top:30px;
					text-align:center;
				"
				>
					<span id=closeButton class=akarabutton
					>Tutup</span>
				</div>
			</div>
		`,
		onadded(){
			//save id on ls.
			localStorage.setItem('newestID',pid);
			this.find('img').onclick = ()=>{
				navigator.clipboard.writeText(pid).then(()=>{
					this.find('#notifyclip span').innerText = 'ID Disalin!';
					setTimeout(()=>{this.remove()},1000);
				})
			}
			this.find('#closeButton').onclick = ()=>{
				this.remove();
			}
		}
	}))
}

const uploadFiles = function(files,cb){
	//start to upload the files.
	let uploadedLength = 0;
	const fileSrc = [];
	const upload = function(){
		const fileData = {
			file:files[uploadedLength],
			name:files[uploadedLength].name,
			contentType:files[uploadedLength].type
		}
		const task = header.storageref.child(fileData.name).put(fileData.file,fileData.contentType);
		task.then(async res=>{
			fileSrc.push(await res.ref.getDownloadURL());
			uploadedLength++;
			if(files.length>uploadedLength){
				upload();
			}else cb(fileSrc);
		})
	}
	//first trigger!
	upload();
}










