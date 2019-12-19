export default class MainPage {
    constructor(context) {
        this._context = context;
        this._rootEl = context.rootEl();
        this._firstPostId = 0;
        this._lastPost = 0;
        this._postsCount = 3;
    }

    init() {
        this._rootEl.innerHTML = `
      <div class="container">
        <nav class="navbar navbar-expand-lg bg-info navbar-dark">
          <a class="navbar-brand" href="#">Социальная сеть</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-supported-content">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbar-supported-content">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <a class="nav-link" data-id="menu-me" href="/details">Моя страница</a>
              </li>
              <li class="nav-item active">
                <a class="nav-link" data-id="menu-main" href="/posts">Лента</a>
              </li>
              <li class="nav-item active">
                <a class="nav-link" data-id="menu-users" href="/users">Пользователи</a>
              </li>              
              <form data-id="logout-form" class="form-inline my-2 my-lg-0">             
              <button type="submit" class="btn btn-info">Выйти</button>
            </form>
            </ul>
            <form data-id="search-form" class="form-inline my-2 my-lg-0">
              <input class="form-control mr-sm-2" type="search" placeholder="Поиск" data-id="search-input">
              <button type="submit" class="btn btn-info">Поиск</button>
            </form>
          </div>
        </nav>
        <br>
        <div class="row">
          <div class="col">
            <div class="card">
              <div class="card-body">
                <form data-id="post-edit-form">
                  <input type="hidden" data-id="id-input" value="0">
                  <div class="form-group">
                    <input type="text" data-id="content-input" class="form-control" id="content-input" placeholder="Поделитесь новостью">
                  </div>
                  <div class="form-group">
                    <div class="custom-file">
                      <input type="hidden" data-id="media-name-input">
                      <input type="file" data-id="media-input" class="custom-file-input" id="media-input">
                      <label class="custom-file-label" for="media-input">Выберите файл</label>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-info">Поделиться</button>
                </form>
              </div>
            </div>
            <div class="row">
            <div class="col" data-id="new-posts"></div>
            </div>
            <br/>
            <div class="row">
              <div class="col" data-id="posts-container"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" data-id="error-modal" tabindex="-1" >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Ошибка!</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div data-id="error-message" class="modal-body">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

        this._rootEl.querySelector('[data-id=menu-main]').addEventListener('click', evt => {
            evt.preventDefault();
        });
        this._rootEl.querySelector('[data-id=menu-me]').addEventListener('click', evt => {
            evt.preventDefault();
            this._context.route(evt.currentTarget.getAttribute('href'));
        });
        this._rootEl.querySelector('[data-id=menu-users]').addEventListener('click', evt => {
            evt.preventDefault();
            this._context.route(evt.currentTarget.getAttribute('href'));
        });

        this._logoutForm = this._rootEl.querySelector('[data-id=logout-form]');
        this._logoutForm.addEventListener('submit', evt => {
            evt.preventDefault();
            this._context.logout();
        });

        this._errorModal = $('[data-id=error-modal]');
        this._errorMessageEl = this._rootEl.querySelector('[data-id=error-message]');
        this._newPostsEl = this._rootEl.querySelector('[data-id=new-posts]');
        this._postsContainerEl = this._rootEl.querySelector('[data-id=posts-container]');
        this._postCreateFormEl = this._rootEl.querySelector('[data-id=post-edit-form]');
        this._idInputEl = this._postCreateFormEl.querySelector('[data-id=id-input]');
        this._contentInputEl = this._postCreateFormEl.querySelector('[data-id=content-input]');
        this._mediaNameInputEl = this._postCreateFormEl.querySelector('[data-id=media-name-input]');
        this._mediaInputEl = this._postCreateFormEl.querySelector('[data-id=media-input]');
        this._searchFormEl = this._rootEl.querySelector('[data-id=search-form]');
        this._searchInputEl = this._searchFormEl.querySelector('[data-id="search-input"]');
        
        
        this._searchFormEl.addEventListener('submit', evt => {
            evt.preventDefault();
            const str = '?q=' + this._searchInputEl.value;
            this._context.get('/posts' + str, {},
                text => {
                    const posts = JSON.parse(text);
                    this.clean();
                    this.loadNewList(posts);

                    this._lastPost=0;
                },
                error => {
                    this.showError(error);
                });
        });
        this._mediaInputEl.addEventListener('change', evt => {
            const [file] = Array.from(evt.currentTarget.files);
            const formData = new FormData();
            formData.append('file', file);
            this._context.post('/files/multipart', formData, {},
                text => {
                    const data = JSON.parse(text);
                    this._mediaNameInputEl.value = data.name;
                },
                error => {
                    this.showError(error);
                });
        });
        this._postCreateFormEl.addEventListener('submit', evt => {
            evt.preventDefault();
            const data = {
                id: Number(this._idInputEl.value),
                content: this._contentInputEl.value,
                media: this._mediaNameInputEl.value || null
            };
            this._context.post('/posts', JSON.stringify(data), {'Content-Type': 'application/json'},
                text => {
                    this._idInputEl.value = 0;
                    this._contentInputEl.value = '';
                    this._mediaNameInputEl.value = '';
                    this._mediaInputEl.value = '';

                    this.clean();
                    this._lastPost++;
                    this.loadMorePosts(0, this._lastPost);
                    this._newPostsEl.innerHTML = '';
                    this.getFirstPost();
                },
                error => {
                    this.showError(error);

                    this._idInputEl.value = 0;
                    this._contentInputEl.value = '';
                    this._mediaNameInputEl.value = '';
                    this._mediaInputEl.value = '';
                });
        });
        this.loadMorePosts(this._lastPost, this._postsCount);
        this._lastPost += this._postsCount;
        this.getFirstPost();

        this.pollNewPosts();
    }

    getFirstPost() {
        this._context.get('/posts', {},
            text => {
                const id = JSON.parse(text);
                this._firstPostId = id;
            },
            error => {
                this.showError(error);
            });
    }

    clean() {
        this._postsContainerEl.innerHTML = ``;
    }

    loadMorePosts(lastPost, step) {
        const str = '?lastPost=' + lastPost + '&step=' + step;
        this._context.get('/posts' + str, {},
            text => {
                const posts = JSON.parse(text);
                this.loadNewList(posts);
            },
            error => {
                this.showError(error);
            });
    }

    loadNewList(posts) {
        if (!posts) {
            return;
        }
        for (const post of posts) {
            const postEl = document.createElement('div');
            let postMedia = '';
            if (post.media !== null) {
                if (post.media.endsWith('.png') || post.media.endsWith('.jpg')||post.media.endsWith('.jpeg')) {
                    postMedia += `
            <img src="${this._context.mediaUrl()}/${post.media}" class="img-responsive mx-auto d-block" style="max-width: 50%;" alt="...">
          `;
                } else if (post.media.endsWith('.mp4') || post.media.endsWith('.webm')) {
                    postMedia = `
            <div class="card-img-topcard-img-top embed-responsive embed-responsive-16by9 mb-2">
              <video src="${this._context.mediaUrl()}/${post.media}" class="embed-responsive-item" controls>
            </div>
          `;
                } else if (post.media.endsWith('.mpeg')) {
                    postMedia = `
            <div class = "card-img-topcard-img-top embed-responsive embed-responsive-16by9 mb-2">
              <audio src = src="${this._context.mediaUrl()}/${post.media}" class = "embed-responsive-item" controls>
            </div>
          `;
                }
            }

            postEl.innerHTML = `
        <div class="card mb-3">
          <div class="card-body">
          <p class="card-text">${post.authorUsername}</p>
          <p class="card-text">${post.created}</p>
          <br/>
            <p class="card-text">${post.content}</p>   
            <br/> 
            <p class="card-text">Понравилось: ${post.likes}</p>
            ${postMedia}
          </div>
          <div class="card-footer">
            <div class="row">
              <div class="col">
                <a href="#" data-action="like" class="btn btn-sm btn-info" >Нравится</a>
                <a href="#" data-action="dislike" class="btn btn-sm btn-danger">Не нравится</a>
              </div>
              <div class="col text-right">
                <a href="#" data-action="edit" class="btn btn-sm btn-info">Редактировать</a>
                <a href="#" data-action="remove" class="btn btn-sm btn-danger">Удалить</a>
              </div>
            </div>
          </div>
          </div>

      `;
            postEl.querySelector('[data-action=like]').addEventListener('click', evt => {
                evt.preventDefault();
                this._context.post(`/posts/${post.id}/likes`, null, {},
                    () => {
                        this.clean();
                        this.loadMorePosts(0, this._lastPost);

                    }, error => {
                        this.showError(error);
                    });
            });
            postEl.querySelector('[data-action=dislike]').addEventListener('click', evt => {
                evt.preventDefault();
                this._context.delete(`/posts/${post.id}/likes`, {},
                    () => {
                        this.clean();
                        this.loadMorePosts(0, this._lastPost);
                    }, error => {
                        this.showError(error);
                    });
            });
            postEl.querySelector('[data-action=edit]').addEventListener('click', evt => {
                evt.preventDefault();
                this._idInputEl.value = post.id;
                this._contentInputEl.value = post.content;
                this._mediaNameInputEl.value = post.media;
                this._mediaInputEl.value = '';
            });
            postEl.querySelector('[data-action=remove]').addEventListener('click', evt => {
                evt.preventDefault();
                this._context.delete(`/posts/${post.id}`, {},
                    () => {
                        this.clean();
                        this._lastPost--;
                        this.loadMorePosts(0, this._lastPost);
                    }, error => {
                        this.showError(error);
                    });
            });
            this._postsContainerEl.appendChild(postEl);
        }
        if (posts) {
            const loadPostEl = document.createElement('div');
            loadPostEl.innerHTML = `
        <div class="card">
          <div class="card-body">
           <div class="col text-center">
            <a href="#" data-action="upload-posts" class="btn btn-sm btn-info">Загрузить больше записей</a>
           </div>
          </div>
        </div>`;
            loadPostEl.querySelector('[data-action=upload-posts]').addEventListener('click', evt => {
                evt.preventDefault();
                this._postsContainerEl.removeChild(loadPostEl);
                this.loadMorePosts(this._lastPost, this._postsCount);
                this._lastPost += this._postsCount;
            });
            this._postsContainerEl.appendChild(loadPostEl);
        }
    }

    pollNewPosts() {
        this._timeout = setTimeout(() => {
            this.newPostsDetected();
            this.pollNewPosts();
        }, 5000);
    }

    newPostsDetected() {
        const str = '?firstPostId=' + this._firstPostId;
        this._context.get('/posts' + str, {},
            text => {
                const count = JSON.parse(text);
                if (count > 0) {
                    this.newPostsAnnotation(count);
                }
            },
            error => {
                this.showError(error);
            });
    }

    newPostsAnnotation(count) {
        this._newPostsEl.innerHTML = '';
        const newPostEl = document.createElement('div');
        newPostEl.innerHTML = `
        <div class="card">
          <div class="card-body">
           <div class="col text-center">
            <a href="#" data-action="new-posts" class="btn btn-sm btn-info">Новых записей: ${count}</a>
           </div>
          </div>
        </div>`;

        newPostEl.querySelector('[data-action=new-posts]').addEventListener('click', evt => {
            evt.preventDefault();
            this._newPostsEl.removeChild(newPostEl);
            this.clean();
            this._lastPost += count;
            this.loadMorePosts(0, this._lastPost);
            this.getFirstPost();
        });
        this._newPostsEl.appendChild(newPostEl);
    }

  showError(error) {
    const data = JSON.parse(error);
    let message = this._context.translate(data.message);
    if (data.errors) {
      for (var key in data.errors) {

        message = message + ' ' + this._context.translate(key) + ':' + this._context.translate(data.errors[key]);
      }
    }
    this._errorMessageEl.textContent = message;
    this._errorModal.modal('show');
  }

    destroy() {
        clearTimeout(this._timeout);
    }
}
