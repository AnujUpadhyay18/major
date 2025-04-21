
    let body = document.querySelector('#package_tbody');
    let tbody = document.querySelector('tbody');
    let type = document.querySelector('#type');
    let search = document.querySelector("#search");
    let sorting = document.querySelector("#sorting");
    let heading = document.querySelector('#container > h2');
    let cta = document.querySelector('.cta');
    let todaySales = document.querySelector('#todaySales');
    let weeklySales = document.querySelector('#weeklySales');
    let monthlySales = document.querySelector('#monthlySales');
    let todaydata = 0;
    let weekdata = 0;
    let monthdata = 0;


    let admindata = JSON.parse(localStorage.getItem('AdminData')) || [];


    heading.textContent = "Welcome Admin "

    // 2023-06-30
    const API = "https://vouge-pocket-hogf.onrender.com/packages?_sort=id&_order=asc";
    const BaseAPI = "https://vouge-pocket-hogf.onrender.com/packages";
    const UserAPI = "https://vouge-pocket-hogf.onrender.com/users";
    const SalesAPI = "https://vouge-pocket-hogf.onrender.com/sales";
    const AdminAPI = "https://vouge-pocket-hogf.onrender.com/login";
    let searchAPI = "https://vouge-pocket-hogf.onrender.com/packages";
    // sendtop
    function sendtop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    operations(API);
    fetchSalesData(SalesAPI);
    fetchUserData(UserAPI);
    fetchAdminData(AdminAPI);

    // admin
    let admin_tbody = document.querySelector("#admin_tbody");
    let typeofadmin = document.querySelector("#typeofadmin");
    let sortingbyname = document.querySelector("#sortingbyname");
    let searchinadmin = document.querySelector("#searchinadmin");
    let admin_add = document.querySelector("#admin_add");
    // admin search
    searchinadmin.addEventListener('input', () => {
        if (searchinadmin.value === "") {
            fetchAdminData(AdminAPI);
        } else {
            fetchAdminData(`${AdminAPI}?${typeofadmin.value}_like=${searchinadmin.value}`);

        }
    })

    // admin sorting
    sortingbyname.addEventListener('change', () => {
        if (sortingbyname.value === "") {
            fetchAdminData(AdminAPI);
        } else {
            fetchAdminData(`${AdminAPI}?_sort=username&_order=${sortingbyname.value}`);
        }
    });

    admin_add.addEventListener('click', () => {
        localStorage.setItem('addnew', JSON.stringify({
            addnew: true
        }));
        window.location.href = "admin_edit_admin.html";
    });

    async function fetchAdminData(AdminAPI) {
        let res = await fetch(AdminAPI);
        let data = await res.json();
        admin_tbody.innerHTML = null;
        data.forEach(element => {
            admin_tbody.append(CreateAdmin(element));
        })
    }
    function CreateAdmin(element) {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td6 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');

        td1.innerHTML = element.id;
        td2.innerHTML = element.username;
        td6.innerHTML = element.email;
        td3.innerHTML = element.password;
        td4.className = "edit_button";
        td4.innerHTML = edit_btn();
        td4.addEventListener('click', () => {
            localStorage.setItem('edit_admin', JSON.stringify(element));
            window.location.href = 'admin_edit_admin.html';
        });
        td5.innerHTML = delete_btn();
        td5.className = "delete_button";

        td5.addEventListener("click", () => {
            let ans = confirm(`ID ${element.id} will delete, are you sure?`);

            if (ans === true) {
                deleting();
                async function deleting() {
                    try {
                        let res = await fetch(`${AdminAPI}/${element.id}`, {
                            method: "DELETE",
                        });
                        if (res.ok) {
                            alert(`Deleted`);
                            location.reload();
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

        })


        tr.append(td1, td2, td6, td3, td4, td5);
        return tr;
    }




    // sales completed
    let typeofsales = document.querySelector('#typeofsales');
    let searchinsales = document.querySelector('#searchinsales');
    let sortingbybill = document.querySelector('#sortingbybill');
    let sales_tbody = document.querySelector("#sales_tbody");
    let sales_add = document.querySelector('#sales_add');

    // sales search
    searchinsales.addEventListener('input', () => {
        if (searchinsales.value === "") {
            fetchSalesData(SalesAPI);
        } else {
            fetchSalesData(`${SalesAPI}?${typeofsales.value}_like=${searchinsales.value}`);

        }
    })

    // sales sorting
    sortingbybill.addEventListener('change', () => {
        if (sortingbybill.value === "") {
            fetchSalesData(API);
        } else {
            fetchSalesData(`${SalesAPI}?_sort=bill&_order=${sortingbybill.value}`);
        }
    });

    sales_add.addEventListener('click', () => {
        localStorage.setItem('addnew', JSON.stringify({
            addnew: true
        }));
        window.location.href = "admin_edit_sales.html";
    });
    async function fetchSalesData(SalesAPI) {
        try {
            let res = await fetch(SalesAPI);
            let data = await res.json();
            sales_tbody.innerHTML = "";
            data.forEach(element => {
                sales_tbody.append(CreateSales(element));
            })
        } catch (error) {
            console.log(error);
        }
    }

    function CreateSales(element) {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td8 = document.createElement('td');
        let td6 = document.createElement('td');

        td6.className = "edit_button";
        td6.addEventListener('click', () => {
            localStorage.setItem('edit_sales', JSON.stringify(element));
            window.location.href = 'admin_edit_sales.html';
        });
        let td7 = document.createElement('td');
        td7.className = "delete_button";

        td7.addEventListener("click", () => {
            let ans = confirm(`ID ${element.id} will delete, are you sure?`);

            if (ans === true) {
                deleting();
                async function deleting() {
                    try {
                        let res = await fetch(`${SalesAPI}/${element.id}`, {
                            method: "DELETE",
                        });
                        if (res.ok) {
                            alert(`Deleted`);
                            location.reload();
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

        })


        let curr = new Date();
        let prev = new Date(element.timestamp);
        let difference = curr.getTime() - prev.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        if (TotalDays < 8) {
            weekdata = weekdata + element.bill;
            weeklySales.textContent = "₹ " + weekdata + ".00";
        }

        if (TotalDays < 30) {
            monthdata = monthdata + element.bill;
            monthlySales.textContent = "₹ " + monthdata + ".00";
        }

        if (TotalDays <= 1) {
            todaydata = todaydata + element.bill;
            todaySales.textContent = "₹ " + todaydata + ".00";
        }

        td1.innerHTML = element.id;
        td2.innerHTML = element.package_name;
        td3.innerHTML = element.name;
        td4.innerHTML = element.email;
        td5.innerHTML = element.bill;
        td8.innerHTML = element.timestamp;
        td6.innerHTML = edit_btn();
        td7.innerHTML = delete_btn();

        tr.append(td1, td2, td3, td4, td5, td8, td6, td7);
        return tr;
    }


    // user completed
    let user_tbody = document.querySelector('#user_tbody');
    let user_add = document.querySelector('#user_add');
    let searchinusers = document.querySelector('#searchinusers');
    let typeofusers = document.querySelector('#typeofusers');
    let sortingbyuser = document.querySelector('#sortingbyuser');
    // user search
    searchinusers.addEventListener('input', () => {
        if (searchinusers.value === "") {
            fetchUserData(UserAPI);
        } else {
            fetchUserData(`${UserAPI}?${typeofusers.value}_like=${searchinusers.value}`);

        }
    })

    // user sorting
    sortingbyuser.addEventListener('change', () => {
        if (sortingbyuser.value === "") {
            fetchUserData(UserAPI);
        } else {
            fetchUserData(`${UserAPI}?_sort=name&_order=${sortingbyuser.value}`);
        }
    });

    user_add.addEventListener('click', () => {
        localStorage.setItem('addnew', JSON.stringify({
            addnew: true
        }));
        window.location.href = "admin_edit_users.html";
    })
    async function fetchUserData(UserAPI) {
        try {
            let res = await fetch(UserAPI);
            let data = await res.json();
            user_tbody.innerHTML = "";
            data.forEach(element => {
                user_tbody.append(CreateUser(element));
            })
        } catch (error) {
            console.log(error);
        }
    }

    function CreateUser(element) {
        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        let td7 = document.createElement('td');
        td7.className = "edit_button";
        td7.addEventListener('click', () => {
            localStorage.setItem('edit_users', JSON.stringify(element));
            window.location.href = 'admin_edit_users.html';
        });
        let td8 = document.createElement('td');
        td8.className = "delete_button";

        td8.addEventListener("click", () => {
            let ans = confirm(`ID ${element.id} will delete, are you sure?`);

            if (ans === true) {
                deleting();
                async function deleting() {
                    try {
                        let res = await fetch(`${UserAPI}/${element.id}`, {
                            method: "DELETE",
                        });
                        if (res.ok) {
                            alert(`Deleted`);
                            location.reload();
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

        })


        td1.innerHTML = element.id;
        td2.innerHTML = element.name;
        td3.innerHTML = element.email;
        td4.innerHTML = element.password;
        td5.innerHTML = element.phone;
        td6.innerHTML = element.state;
        td7.innerHTML = edit_btn();
        td8.innerHTML = delete_btn();

        tr.append(td1, td2, td3, td4, td5, td6, td7, td8);
        return tr;
    }


    // packages data
    // add new data
    cta.addEventListener('click', () => {
        let len = localStorage.getItem('DataLength');
        localStorage.setItem('addnew', JSON.stringify({
            // id: Number(len) + 1,
            addnew: true
        }));
        window.location.href = "admin_edit_packages.html";
    });
    // searching

    search.addEventListener('input', () => {
        if (search.value == "") {
            operations(BaseAPI);
        } else {
            operations(`${BaseAPI}?${type.value}_like=${search.value}`);
        }

    })


    // sorting 
    sorting.addEventListener('change', () => {
        if (sorting.value === "") {
            operations(API);
        } else {
            console.log(sorting.value);
            let changeAPI = `${BaseAPI}?_sort=price&_order=${sorting.value}`;

            operations(changeAPI);
        }
    });

    // async function fetchData(){
    //     try {
    //         let res = await fetch(`${API}?_sort=id&_order=asc`);
    //         let data = await res.json();
    //         console.log(data);
    //         tbody.innerHTML = null;
    //        
    //         data.forEach(function(item){
    //             tbody.append(DisplayData(item));
    //         });
    //         
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    async function operations(changeAPI) {
        try {
            let res = await fetch(changeAPI);
            let data = await res.json();
            // console.log(data);
            tbody.innerHTML = null;
            localStorage.setItem('DataLength', data.length);
            data.forEach(function (item) {
                tbody.append(DisplayData(item));
            });


        } catch (error) {
            console.log(error);
        }
    }
    function DisplayData(item) {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        let td7 = document.createElement('td');

        td1.textContent = item.id;
        td2.textContent = item.title;
        td3.textContent = item.destination;
        td4.textContent = item.duration;
        td5.textContent = item.price;

        td6.className = "edit_button";
        td6.innerHTML = edit_btn();
        td6.addEventListener('click', () => {
            console.log(item.id);
            localStorage.setItem('edit', JSON.stringify(item));
            window.location.href = 'admin_edit_packages.html';
        });

        td7.className = "delete_button";
        td7.innerHTML = delete_btn();

        td7.addEventListener("click", () => {
            let ans = confirm(`ID ${item.id} will delete, are you sure?`);

            if (ans === true) {
                deleting();
                async function deleting() {
                    try {
                        let res = await fetch(`${BaseAPI}/${item.id}`, {
                            method: "DELETE",
                        });
                        if (res.ok) {
                            alert(`Deleted`);
                            location.reload();
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

        })

        tr.append(td1, td2, td3, td4, td5, td6, td7);
        return tr;
    }


    function edit_btn() {
        return `<button>
  <div class="svg-wrapper-1">
    <div class="svg-wrapper">
      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
      </svg>
    </div>
  </div>
  <span>Edit</span>
</button>`;

    }
    function delete_btn() {
        return `<button class="noselect"><span class="text">Delete</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>`;
    }


    // side bar
    function openNav() {
        document.getElementById("mySidenav").style.width = "250px";
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }

