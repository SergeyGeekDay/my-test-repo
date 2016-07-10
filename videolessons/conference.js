var ObjectsStore;

var MainApplicationConference = React.createClass({
	onClickHere: function(e) {
		open('/models/videoconf/');
	},
	
	getAllObjects: function() {
		var self = this;
		
		void fetchServer('subject.json', '', function(data) {			
			ObjectsStore = data.map(function(e, i) {
				return (
					<div key={i} className="std-list-item" onClick={self.onClickHere}>
					
						<div className="col-md-6">
							<img src={e.png + '.png'} alt="Картинка" />
						</div>
						<div className="col-md-6">
							<h5>{e.subject}</h5>
						</div>
						<div className="col-md-12">
							<br /><i className="std-class descr-i">{e.description}</i>
						</div>
						<div className="gap-10"></div>
						<div className="gap-10"></div>
						<div className="gap-10"></div>
					</div>
				);
			});
		});
	},
	
	render: function() {
		this.getAllObjects();
		
		return (
			<section className="conf-std">
				<h1 className="text-center">Зал конференции</h1>
				<div className="container">
					<div className="col-xs-6">
					<div className="panel panel-info">
					  <div className="panel-heading">
						<h3 className="panel-title">Создать урок по предмету</h3>
					  </div>
					  <div className="panel-body">
						<div className="">
						{ObjectsStore}
						</div>
					  </div>
					</div>
					</div>
					<div className="col-xs-6">
						<div className="panel panel-success">
					  <div className="panel-heading">
						<h3 className="panel-title">Уроки идут в данный момент</h3>
					  </div>
					  <div className="panel-body">
						Panel content
					  </div>
					</div>
					</div>
				</div>
			</section>
		);
	},	
});


function fetchServer(path, params, success)
{	
	$.ajax({
		url: path,
		dataType: 'json',
		cache: false,
		type: 'POST',
		data: params,
		async: false,
		
		success: success.bind(this),
	});
}


function globalRender() {
	ReactDOM.render(
		<MainApplicationConference />,
		document.getElementById('calls-application-container'),
		function() {
			
		}
	);
};

void globalRender();