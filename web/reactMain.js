        var internalLinkData = {
          'Home':{
            link:'/api/pages/home'
          },
          'Photoshop':{
            link:'/api/pages/photoshop'
          },
          'Illustrator':{
            link:'/api/pages/illustrator'
          },
          'Audio':{
            link:'/api/pages/audio'
          },
          'Video':{
            link:'/api/pages/video'
          }};
        var InternalLink = React.createClass({
          render: function(){
            return (
                <button onClick={this.props.changeSelected} className={'btn ' + (this.props.active ? 'btn-primary' : 'btn-default')}>{this.props.name}</button>
            );
          }
        });
        var EditModal = React.createClass({
          getInitialState: function(){return {typeSelected:'text'};},
          contentMap: {
            'text': 'the body of the post',
            'video': 'the Youtube video ID',
            'image': 'the image location on the server'
          },
          changedTypeSelected: function(){
            this.setState({typeSelected = $('#typeSelect').val()});
            $('#editDescriptionContainer').attr('hidden', this.state.typeSelected === 'text');
          },
          render: function(){
            var contentDiscription = this.contentMap[this.props.selected.type];
            return(
            <div className="modal modal-fade" id="editModal">
              <div className="modal-dialog modal-lg">
                <div className='modal-content'>
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Edit Post</h4>
                  </div>
                  <div className="modal-body">
                    <form className="form-horizontal">
                      <div className='form-group'>
                        <label className='col-sm-4 control-label' htmlFor='editTitle'>Title:</label>
                        <div className='col-sm-8'>
                            <input id='editTitle' type="text" className='form-control' placeholder='Title' value={this.props.selected.props.title}/>
                        </div>
                      </div>
                      <div className='form-group'>
                        <div className='form-group'>
                          <label className='col-sm-4 control-label' htmlFor='typeSelect'>Type:</label>
                          <div className='col-sm-8'>
                            <select id='typeSelect' className="form-control" onChange={this.changedTypeSelected} selected={this.props.selected.props.type}>
                              <option value='text'>Text</option>
                              <option value='video'>Video</option>
                              <option value='image'>Image</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='form-group'>
                        <label className='col-sm-4 control-label' htmlFor='editContent'>Content ({contentDiscription}):</label>
                        <div className='col-sm-8'>
                            <input id='editContent' type="text" className='form-control' placeholder='Content' value={this.props.selected.props.content}/>
                        </div>
                      </div>
                      <div className='form-group' id='editDescriptionContainer' hidden={this.state.typeSelected === 'text'}>
                        <label className='col-sm-4 control-label' htmlFor='editDescription'>Description:</label>
                        <div className='col-sm-8'>
                            <input id='editDescription' type="text" className='form-control' placeholder='Description' value={this.props.selected.props.description || ""}/>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    <button id="saveChangesButton" type="button" className="btn btn-primary">Save changes</button>
                  </div>
                </div>
              </div>
            </div>
          );}
        });
        var ReactBody = React.createClass({
          getInitialState: function(){ return {selected:'Photoshop'};},
          handleSelectedChangeCurry: function(newSelected){
            return function() {this.setState({selected:newSelected})};
          }.bind(this),
          render: function(){
            var internalLinks = Object.keys(internalLinkData).map( function(key){
              return(
                <InternalLink name={key} active={ key === this.state.selected } key={key} changeSelected={this.handleSelectedChangeCurry(key).bind(this)}/>
              );
            }, this);
            return (
              <div className="mainBody row">
                <div className="sidebar col-sm-2 btn-group-vertical" role="group">
                  {internalLinks}
                </div>
                <div className="container-fluid contentContainer">
                    <div className="pageContent col-sm-8 col-sm-offset-2">
                      <PostList url={internalLinkData[this.state.selected].link} />
                    </div>
                </div>

            </div>

            );
          }
        })
        var ImagePost = React.createClass({
          render: function(){
            return (
            <div className='post panel panel-primary'>
              <div className='panel-heading'>
                <span className='panel-title'>{this.props.title}</span>
                <button className='editButton btn btn-warning' onClick={this.props.handleEdit(this)}><span className='glyphicon glyphicon-pencil'></span></button>
              </div>
              <div className='panel-body'>
                <img className='img-responsive panelContent' src={this.props['data-image']}/>
              </div>
              <div className='panel-footer'>
                <p>{this.props['data-description']}</p>
              </div>
            </div>
          );}
        });
        var TextPost = React.createClass({
          render: function(){
            return (
              <div className='post panel panel-primary'>
              <div className='panel-heading'>
                <span className='panel-title'>{this.props.title}</span>
                <button className='editButton btn btn-warning' onClick={this.props.handleEdit(this)}><span className='glyphicon glyphicon-pencil'></span></button>
              </div>
              <div className='panel-body'>
                <p className='panelContent'>{this.props.content}</p>
              </div>
            </div>

          );}
        });
        var VideoPost = React.createClass({
          render: function(){
            return (
              <div className='post panel panel-primary'>
              <div className='panel-heading'>
                <span className='panel-title'>{this.props.title}</span>
                <button className='editButton btn btn-warning' onClick={this.props.handleEdit(this)}><span className='glyphicon glyphicon-pencil'></span></button>
              </div>
              <div className='panel-body'>
                <iframe className='panelContent' width="560" height="315" src={"https://www.youtube.com/embed/"+this.props.content} frameBorder="0" allowFullScreen></iframe>
              </div>
              <div className='panel-footer'>
                <p>{this.props['data-description']}</p>
              </div>
            </div>

          );}
        });
        var PostList = React.createClass({
          getInitialState: function() {
            return {postsData: [], selectedPost:{props:{title:'',content:'', description:'', type:'text'}}};
          },
          componentDidMount: function(){
            $.ajax({
              url: this.props.url,
              dataType: 'json',
              success: function(data) {
                console.log(`got data from server: ${data}`);
                this.setState({postsData: data});
              }.bind(this),
              error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
              }.bind(this)
            });
          },
          componentWillReceiveProps: function(nextProps) {
            if(nextProps.url === this.props.url) return;
            $.ajax({
              url: nextProps.url,
              dataType: 'json',
              success: function(data) {
                console.log(`got data from server: ${data}`);
                this.setState({postsData: data});
              }.bind(this),
              error: function(xhr, status, err) {
                console.error(nextProps.url, status, err.toString());
              }.bind(this)
            });
          },
          editButtonHandlerCurry: function (post) {
            return function(){
              $('#editModal').modal('show');
              this.setState({selectedPost: post});
              console.log(this.state.selectedPost);
            }.bind(this);
          },
          render: function() {
            var posts = this.state.postsData.map((post) => {
              if (post.type === 'image'){
                return (
                  <ImagePost handleEdit={this.editButtonHandlerCurry} title={post.title} data-image={post.content} data-description={post.description} key={post.id}/>
                );}
              if (post.type === 'text'){
                return (
                  <TextPost handleEdit={this.editButtonHandlerCurry} title={post.title} content={post.content} key={post.id}/>
              );}
              if (post.type === 'video'){
                return(
                  <VideoPost handleEdit={this.editButtonHandlerCurry} title={post.title} content={post.content} key={post.id} data-description={post.description}/>
              );}

              return(<p>Unrecognized Content</p>);
            });
            return (
              <div className="postList">
                {posts}
                <EditModal key={-1} selected={this.state.selectedPost} ref={(ref) => this.editModal = ref}/>
              </div>
            );
          }
        });
        ReactDOM.render(
          <ReactBody/>,
          document.getElementById('content')
        );
