const background = makeElement('img',{
	src:'/file?fn=background-5964794_1920.jpg',
	style:`
		width:100%;
		height:100%;
		object-fit:cover;
		position:relative;
	`,
});

const content = makeElement('content',{
	storageref:firebase.storage().ref(),
	productsref:firebase.database().ref('products'),
	newProductsRef(string){
		return firebase.database().ref(`products/${string}`);
	},
	style:`
		position:absolute;
		display:flex;
		flex-direction:column;
	`,
	innerHTML:`
		<div>
			<div
			style="
				background:white;
				padding:20px;
				display:flex;
				align-items:center;
				font-weight:bold;
			"
			>	
				<img src=file?fn=goodicon.png
				style="
					width:32px;
					height:32px;
					margin-right:10px;
					object-fit:cover;
				">
				<span>AKARA ADMIN</span>
			</div>
		</div>
		<div id=body
		style="
			display:flex;
			height:100%;
			width:100%;
		"
		></div>
	`,
	onadded(){
		const body = this.find('#body');
		body.addChild(leftSide);
		body.addChild(centerSide);
		body.addChild(rightSide);
	}
})


const leftSide = makeElement('div',{
	id:`leftSide`,
	innerHTML:`
		<div class=button id=order
		style="
			padding:10px;
			background:white;
			display:flex;
			align-items:center;
			justify-content:center;
			margin-bottom:10px;
			flex-direction:column;
			width:80%;
			cursor:pointer;
		"
		>
			<img src=/file?fn=giftbox.png
			style="
				width:24px;
				height:24px;
				margin-bottom:5px;
			"
			>
			<div>ORDER</div>
		</div>
		<div class=button id=pending
		style="
			padding:10px;
			background:white;
			display:flex;
			align-items:center;
			justify-content:center;
			margin-bottom:10px;
			flex-direction:column;
			width:80%;
			cursor:pointer;
		"
		>
			<img src=/file?fn=pending.png
			style="
				width:24px;
				height:24px;
				margin-bottom:5px;
			"
			>
			<div>PENDING</div>
		</div>
		<div class=button id=done
		style="
			padding:10px;
			background:white;
			display:flex;
			align-items:center;
			justify-content:center;
			margin-bottom:10px;
			flex-direction:column;
			width:80%;
			cursor:pointer;
		"
		>
			<img src=/file?fn=received.png
			style="
				width:24px;
				height:24px;
			"
			>
			DONE
		</div>
	`,
	onadded(){
		const map = {
			order(){
				loadData(0)
			},
			pending(){
				loadData(1);
			},
			done(){
				loadData(2);
			}
		};
		this.findall('.button').forEach(button=>{
			button.onclick = ()=>{
				map[button.id]();
			}
		})
	}
});
const centerSide = makeElement('div',{
	id:'centerSide',
	onadded(){
		loadData();
	}
});

const rightSide = makeElement('div',{
	id:'rightSide',
	innerHTML:`
		<div id=loading
		style="
			height:100%;
			display:flex;
			align-items:center;
			justify-content:center;
			flex-direction:column;
		"
		>
			Belum Ada Data!
		</div>
	`,
	onadded(){
	}
});

const datanull = function(){
	centerSide.find('#loading').setHTML(`
		Belum Ada Data!
	`)
}

const processData = function(d,target=0){
	centerSide.find('#loading').remove();
	centerSide.addChild(makeElement('div',{
		innerHTML:`${target===0?'ORDER':target===1?'PENDING':'DONE'}`,
		style:`
			margin-bottom:10px;
			position:sticky;
			top:0;
			background:white;
		`
	}))
	let putted = 0;
	const data = [];
	Object.keys(d).forEach(key=>{
		data.push(Object.assign(d[key],{key}));
	});
	if(target===1)data.sort(function(a,b){
		const ad = a.deadline.split('/');
		const bd = b.deadline.split('/');
		const atime = new Date(`${ad[1]+' '+ad[0]}`).getTime();
		const btime = new Date(`${bd[1]+' '+bd[0]}`).getTime();
		return atime - btime;
	});
	data.forEach(data=>{
		if(data.status===target){
			putted++;
			centerSide.addChild(makeElement('div',{
				data,
				style:`
					display:flex;
					justify-content:center;
					padding:5px;
					flex-direction:column;
					background:#ececec;
					cursor:pointer;
					margin-bottom:6px;
				`,
				innerHTML:`
					<div>
						<span
						style="
							font-size:12px;
						"
						>Deadline: ${data.deadline||'NO DATA'}</span>
					</div>
					<div>
						<span>Nama: ${data.name}</span>
					</div>
					<div>
						<span>Catatan: ${data.notes.slice(0,20)}...</span>
					</div>
				`,
				onclick(){
					content.clickedDiv = this;
					this.processPreview();
				},
				processPreview(){
					rightSide.clear();
					rightSide.addChild(makeElement('div',{
						style:`
							background:white;
							padding:10px;
							font-size:14px;
						`,
						innerHTML:`
							<div
							style="
								display:flex;
								justify-content:space-between;
								margin-bottom:10px;
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
									text-align:right;
								">
									<span>${this.data.name}</span>
								</div>
							</div>
							<div
							style="
								display:flex;
								justify-content:space-between;
								margin-bottom:10px;
								align-items:center;
							">
								<div
								style="
									width:50%;
								">
									<span>Deadline</span>
								</div>
								<div
								style="
									width:50%;
									text-align:right;
								">
									<span id=deadline>${this.data.deadline||'NO DATA'}</span>
									<span class=akarabutton
									style="
										padding:5px;
										margin-left:5px;
										font-size:14px;
									"
									id=changedeadline
									>Ubah</span>
								</div>
							</div>
							<div
							style="
								display:flex;
								justify-content:space-between;
								margin-bottom:10px;
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
									text-align:right;
								">
									<span>${this.data.stuffname}</span>
								</div>
							</div>
							<div
							style="
								display:flex;
								justify-content:space-between;
								margin-bottom:10px;
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
									text-align:right;
								">
									<span>${this.data.typeofbroken}</span>
								</div>
							</div>
							<div
							style="
								display:flex;
								justify-content:space-between;
								margin-bottom:10px;
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
									text-align:right;
								">
									<span>${this.data.notes}</span>
								</div>
							</div>
							<div
							style="
								display:flex;
								justify-content:space-between;
								margin-bottom:10px;
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
									text-align:right;
								">
									<span>${this.data.whoarei}</span>
								</div>
							</div>
							<div
							style="
								display:flex;
								justify-content:space-between;
								margin-bottom:10px;
								align-items:center;
							">
								<div
								style="
									width:50%;
								">
									<span>Foto Barang (${this.data.fileSrc.length})</span>
								</div>
								<div
								style="
									width:50%;
									display:flex;
									justify-content:flex-start;
									scrollbar-width:thin;
									overflow:auto;
								"
								id=files
								>
								</div>
							</div>
							<div
							style="
								display:${this.data.location?'flex':'none'};
								justify-content:space-between;
								margin-bottom:10px;
								align-items:center;
							">
								<div
								style="
									width:50%;
								">
									<span>Lokasi</span>
								</div>
								<div
								style="
									width:50%;
									text-align:right;
								">
									<a href=https://www.google.com/maps/place/${this.data.location} target="_blank">
										<img src=file?fn=google-maps.png
										style="
											width:24px;
											height:24px;
											cursor:pointer;
										"
										>
									</a>
									
								</div>
							</div>
							<div
							style="
								display:flex;
								justify-content:space-between;
								margin-bottom:10px;
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
									text-align:right;
								">
									<input type=number id=cost placeholder="Example: 30.000"
									style="
										pading:10px;
										background:#ececec;
									"
									value=${this.data.cost||'-'}
									>
								</div>
							</div>
							<div
							style="
								display:flex;
								justify-content:space-between;
								margin-bottom:10px;
								align-items:flex-start;
								flex-direction:column;
							">
								<div
								style="
									margin-bottom:10px;
								">
									<span>Catatan Admin</span>
								</div>
								<div
								style="
									width:100%;
								"
								>
									<textarea type=number id=adminnotes placeholder="Tulis detail pekerjaanmu disini"
									style="
										pading:10px;
										background:#ececec;
										border:none;
										width:100%;
										outline:none;
									"
									>${this.data.adminnotes||''}</textarea>
								</div>
							</div>
							<div
							style="
								display:flex;
								justify-content:space-between;
								margin-bottom:10px;
								align-items:flex-start;
								flex-direction:column;
							">
								<div
								style="
									margin-bottom:10px;
								">
									<span>Barang Diganti</span>
								</div>
								<div
								style="
									width:100%;
								"
								>
									<textarea type=number id=changedStuff placeholder="Tulis detail barang disini"
									style="
										pading:10px;
										background:#ececec;
										border:none;
										width:100%;
										outline:none;
									"
									>${this.data.changedStuff||''}</textarea>
								</div>
							</div>
							<div
							style="
								margin-top:20px;
								padding:10px;
								display:${target!=2?'flex':'none'};
							"
							>
								<div
								style="
									text-align:center;
									margin-right:5px;
								"
								id=savebutton
								>
									<span class=akarabutton
									>Simpan</span>
								</div>
								<div
								style="
									text-align:center;
								"
								id=finishbutton
								>
									<span class=akarabutton
									>Selesai</span>
								</div>
							</div>
							<div
							style="
								margin-top:20px;
								padding:10px;
								display:${target===2?'block':'none'};
							"
							>
								<div
								style="
									text-align:center;
								"
								id=deletebutton
								>
									<span class=akarabutton
									>Hapus</span>
								</div>
							</div>
						`
					}))
					this.displayFiles();
					rightSide.find('#changedeadline').onclick = ()=>{
						find('main').addChild(makeElement('div',{
							style:`
								position:absolute;
								top:0;
								left:0;
								width:100%;
								height:100%;
								display:flex;
								align-items:center;
								justify-content:center;
								background:#00000091;
							`,
							innerHTML:`
								<div
								style="
									background:white;
									padding:30px;
								"
								>
									<div>
										<div>
											<span style="font-weight:bold">Tanggal</span>
										</div>
										<div>
											<input type=date id=date>
										</div>
									</div>
									<div>
										<div>
											<span
											style="font-weight:bold"
											>Waktu</span>
										</div>
										<div>
											<input type=time id=time>
										</div>
									</div>
									<div
									style="
										margin-top:20px;
										text-align:center;
									"
									>
										<span class=akarabutton id=savebutton>Simpan</span>
									</div>
								</div>
							`,
							onadded(){
								this.find('#savebutton').onclick = ()=>{
									rightSide.find('#deadline').innerHTML = this.find('#time').value+'/'+this.find('#date').value;
									this.remove();
								}
							}
						}))
					}
					rightSide.find('#finishbutton').onclick = ()=>{
						const cost = rightSide.find('#cost').value||0;
						//time to update db.
						content.newProductsRef(this.data.key).update({cost,status:2}).then(()=>{
							content.clickedDiv.remove();
							rightSide.setHTML(`
								<div id=loading
								style="
									height:100%;
									display:flex;
									align-items:center;
									justify-content:center;
									flex-direction:column;
								"
								>
									Berhasil Menyimpan Perubahan!
								</div>
							`)
							loadData(target);
						})
					}
					rightSide.find('#savebutton').onclick = ()=>{
						//time to update db.
						content.newProductsRef(this.data.key).update({
							cost:rightSide.find('#cost').value||0,
							status:1,
							deadline:rightSide.find('#deadline').innerHTML,
							adminnotes:rightSide.find('#adminnotes').value||'-',
							changedStuff:rightSide.find('#changedStuff').value||'-'
						}).then(()=>{
							content.clickedDiv.remove();
							rightSide.setHTML(`
								<div id=loading
								style="
									height:100%;
									display:flex;
									align-items:center;
									justify-content:center;
									flex-direction:column;
								"
								>
									Berhasil Menyimpan Perubahan!
								</div>
							`)
							loadData(target);
						})
					}
					rightSide.find('#deletebutton').onclick = ()=>{
						content.newProductsRef(this.data.key).remove().then(()=>{
							content.clickedDiv.remove();
							rightSide.setHTML(`
								<div id=loading
								style="
									height:100%;
									display:flex;
									align-items:center;
									justify-content:center;
									flex-direction:column;
								"
								>
									Berhasil Menyimpan Perubahan!
								</div>
							`)
							loadData(2);
						})
					}
				},
				displayFiles(){
					this.data.fileSrc.forEach(src=>{
						rightSide.find('#files').addChild(makeElement('img',{
							src:'/file?fn=download.png',
							style:`
								width:24px;
								height:24px;
								margin-right:5px;
								cursor:pointer;
								margin-bottom:5px;
							`,
							onclick(){
								this.src = '/file?fn=check-mark.png';
								window.open(src);
							}
						}));
					})
				}
		}))
		}
	})
	if(putted===0){
		centerSide.addChild(makeElement('div',{
			innerHTML:`Tidak Ada Data!`,
			style:`
				margin-bottom:10px;
				position:sticky;
				top:0;
				background:white;
			`
		}))
	}
}

const loadData = function(target=0){
	centerSide.clear();
	centerSide.addChild(makeElement('div',{
		id:'loading',
		style:`
			height:100%;
			display:flex;
			align-items:center;
			justify-content:center;
			flex-direction:column;
		`,
		innerHTML:`
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
		`
	}))
	content.productsref.get().then(data=>{
		data = data.val();
		if(!data){
			datanull()
		}else{
			processData(data,target);
		}
	})
}