var GlobalVarPostsState;

var WallBoard = React.createClass({
	getInitialState: function() {
		return {
			'globalLang': 'ru',
			'inputLang': 'ru',
			'defaultLang': 'ru',
		};
	},
	
	severalPhrases: [
		{'post': 'Это первая интерактивная стена перевода'},
		{'post': 'Вы можете выбрать язык отображения'},
		{'post': 'Сообщение'},
		{'post': 'Автор'},
		{'post': 'Выделить сообщение'},
		{'post': 'Отправить'},
	],
		
	onSubmit: function(e) {
		e.preventDefault();
		
		var dt = document.forms.postFormName.elements;
		var ob = {
			"id": GlobalVarPostsState.length + 1,
			"author": dt.author.value,
			"post": dt.post.value,
			"show": dt.show.checked ? 1 : 0
		};
		
		ob.post = yandexTranslate(new Array(ob), this.state.defaultLang)[0];		
		
		GlobalVarPostsState.unshift(ob);
		
		$.ajax({
			url: 'write.php',
			dataType: 'text',
			cache: false,
			type: 'POST',
			data: 'data=' + JSON.stringify(GlobalVarPostsState),
			async: false,
			
			success: function(data) {
				document.forms.postFormName.reset();
				void renderMainApp();
			}.bind(this),
		});
	},
	
	onChangeLanguage: function(e) {
		this.setState({'globalLang': e.target.value});
	},
	
	onChangeInputLanguage: function(e) {
		this.setState({'inputLang': e.target.value});
	},
	
	render: function() {		
		var prases = yandexTranslate(this.severalPhrases, this.state.inputLang);
		
		return (
		<section className="container-sect std-class">
			<h1 className="text-decor std-class">
				<a href="/">
					<img src="back.png" alt="back" />
				</a>
			</h1>
			<h1 className="text-center">{prases[0]}</h1>
			<h3><b>{prases[1]}</b>			
			<LangChanger
				init={this.state.globalLang}
				onChangeLanguage={this.onChangeLanguage}
				change='globalLang'
			/>
			</h3>
			<hr />
			<PostBlocks lang={this.state.globalLang} />
			<hr />
			<form onSubmit={this.onSubmit} name="postFormName" className="form-horizontal">				
			  <div className="col-sm-12 form-group">
				<label htmlFor="inputEmail3" className="col-sm-2 control-label">{prases[2]}</label>
		
				  <textarea className="form-control" rows="3"
					name="post"
				  placeholder={prases[2]}></textarea>
		
			  </div>
			  <div className="col-sm-12 form-group">
				<label htmlFor="inputPassword3"
					className="col-sm-2 control-label std-class"
				>{prases[3]}</label>
				
				  <input className="form-control author-name"
					id="inputPassword3" placeholder={prases[3]} name="author"
				  />
				  <LangChanger
						init={this.state.inputLang}
						onChangeLanguage={this.onChangeInputLanguage}
						change='inputLang'
					/>
			  </div>
			  <div className="col-sm-12 form-group">
				<div className="col-sm-offset-2 col-sm-10">
				  <div className="checkbox">
					<label>
					  <input type="checkbox" name="show" /> {prases[4]}
					</label>
				  </div>
				</div>
			  </div>
			  <div className="col-sm-12 form-group">
				<div className="col-sm-offset-2 col-sm-10">
				  <button type="submit" name="affirmative"
					className="btn btn-default"
					>{prases[5]}</button>
				</div>
			  </div>
			</form>
		</section>
		);
	},
	
});

var LangChanger = React.createClass({
	getInitialState: function() {
		var obj = new Object();
		obj[this.props.change] = this.props.init;
		
		return obj;
	},
	
	onChangeLanguage: function(e) {
		var state = new Object;
		state[this.props.change] = e.target.value;
		
		this.setState(state);
		this.props.onChangeLanguage(e);
	},
	
	render: function() {
		return (
			<select
				onChange={this.onChangeLanguage}
				value={this.state[this.props.change]}
				className="form-control lang-cls"
			>
				<option value="ru">Русский</option>
				<option value="en">English</option>
				<option value="de">Deutsch</option>
				<option value="zh">中国</option>
				<option value="es">España</option>
				<option value="fr">Français</option>
				<option value="ja">日本語</option>
			</select>
		);
	},
});


var PostBlocks = React.createClass({
	getInitialState: function() {
		return {'posts': new Array()};
	},
	
	getJsonFunction: function() {			
		$.ajax({
			url: 'posts.json',
			dataType: 'json',
			cache: false,
			type: 'POST',
			data: 'nothing',
			async: false,
			
			success: function(data) {
				GlobalVarPostsState = data;
				
				data = data.slice(0, 6);
				
				var translate = yandexTranslate(data, this.props.lang);
					
				this.state.posts = data.map(function(elem, iter) {
					var bcolor = (iter % 2) === 0 ? 'success' : 'info';					
					bcolor = elem.show == '1' ? 'warning' : bcolor;
										
					return (
						<li key={elem.id}
							className={"list-group-item list-group-item-" + bcolor}>
							{translate[iter]}
							<br />
							<br />
							<div className="text-right"><i>By</i> {elem.author}</div>
						</li>
					);
				});
			}.bind(this),
		});
	},
	
	render: function() {
		this.getJsonFunction();
		
		return (
			<ul className="list-group">
			{this.state.posts}
			</ul>
		);
	},
});

function yandexTranslate(textAr, lang)
{
	var trns;
	
	var ya_trans = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
	var ya_key = 'key=trnsl.1.1.20160706T213751Z.8c13d085a7461f88.7d2c55f547eb0f131e33e078c86a90cbbbda6378';
	var ya_par =  'lang=' + lang;	
	var ya_tx;
	
	textAr.forEach(function(ent, i) {
		ya_tx += "&text=" + textAr[i].post;
	});
	
	ya_tx = ya_tx.substr(1);
	
	$.ajax({
		url: ya_trans + '?' + ya_key + '&' + ya_par + '&' + ya_tx,
		dataType: 'text',
		cache: false,
		type: 'GET',
		async: false,
		
		success: function(data) {
			trns = JSON.parse(data).text;
		}.bind(this),
	});
	
	return trns;
}


function renderMainApp() {
	ReactDOM.render(
		<WallBoard />,
		document.getElementById('board-application-container'), function() {
			
		}
	);
}

void renderMainApp();