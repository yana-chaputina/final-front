export default class UserPage {
    constructor(context) {
        this._context = context;
        this._rootEl = context.rootEl();
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
        <div class="col" data-id="users-container"></div>
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
            this._context.route(evt.currentTarget.getAttribute('href'));

        });
        this._rootEl.querySelector('[data-id=menu-me]').addEventListener('click', evt => {
            evt.preventDefault();
            this._context.route(evt.currentTarget.getAttribute('href'));
        });
        this._rootEl.querySelector('[data-id=menu-users]').addEventListener('click', evt => {
            evt.preventDefault();
        });

        this._logoutForm = this._rootEl.querySelector('[data-id=logout-form]');
        this._logoutForm.addEventListener('submit', evt => {
            evt.preventDefault();
            this._context.logout();
        });

        this._errorModal = $('[data-id=error-modal]');
        this._errorMessageEl = this._rootEl.querySelector('[data-id=error-message]');
        this._usersContainerEl = this._rootEl.querySelector('[data-id=users-container]');
        this._searchFormEl = this._rootEl.querySelector('[data-id=search-form]');
        this._searchInputEl = this._searchFormEl.querySelector('[data-id="search-input"]');

        this._searchFormEl.addEventListener('submit', evt => {
            evt.preventDefault();
            const str = '?q=' + this._searchInputEl.value;
            this._context.get('/users' + str, {},
                text => {
                    const users = JSON.parse(text);
                    this.clean();
                    this.loadNewList(users);
                },
                error => {
                    this.showError(error);
                });
        });

        this.loadUsers();
    }

    clean() {
        this._usersContainerEl.innerHTML = ``;
    }

    loadUsers() {
        this._context.get("/users", {},
            text => {
                const users = JSON.parse(text);
                this.loadNewList(users);
            },
            error => {
                this.showError(error);
            });
    }

    loadNewList(users) {
        if (users.length==0) {
            const userEl = document.createElement('div');
            userEl.innerHTML=`
            <h6 style="text-align: center">Ничего не найдено!</h6>
            `;
            this._usersContainerEl.appendChild(userEl);
            return;
        }
        for (const user of users) {
            const userEl = document.createElement('div');
            userEl.innerHTML = `
          <div class="card mb-3">
           <div class="row no-gutters">
           <img src="${this._context.mediaUrl()}/${user.photo}" style="max-width: 15%;" class="img-fluid" alt="...">
           <div class="card-body">
            <p class="card-text">Имя: ${user.name}</p>
            <p class="card-text">Логин: ${user.username}</p>
            <p class="card-text">Email: ${user.email}</p>
           </div>
          </div>
      `;
            this._usersContainerEl.appendChild(userEl);
        }
    }


    showError(error) {
        const data = JSON.parse(error);
        const message = this._context.translate(data.message);
        this._errorMessageEl.textContent = message;
        this._errorModal.modal('show');
    }

    destroy() {
        clearTimeout(this._timeout);
    }
}
