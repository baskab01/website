const SUPABASE_URL = "https://nknshstqgxvohpsxbbnm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_j_-Cwzdrdw3_SyMXpMrAtw_W0b_avAO";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* ================= PRODUCTS ================= */

async function loadProducts() {

    const productList =
        document.getElementById("product-list");

    if (!productList) return;


    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("id", { ascending: false });


    if (error) {

        console.error(error);

        productList.innerHTML = `
            <div class="loading">
                ไม่สามารถโหลดสินค้าได้
            </div>
        `;

        return;
    }


    if (!data || data.length === 0) {

        productList.innerHTML = `
            <div class="loading">
                ยังไม่มีสินค้า
            </div>
        `;

        return;
    }


    productList.innerHTML = "";


    data.forEach(product => {

        const image =
            product.image || "ghost.png";

        const description =
            product.description || "ไม่มีรายละเอียดสินค้า";


        const card = document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <img
                class="product-image"
                src="${image}"
                alt="${product.name}"
                onerror="this.src='ghost.png'"
            >

            <div class="product-info">

                <div class="product-name">
                    ${product.name}
                </div>

                <div class="product-description">
                    ${description}
                </div>

                <div class="product-bottom">

                    <div class="product-price">
                        ฿${Number(product.price).toLocaleString()}
                    </div>

                    <div class="product-stock">
                        เหลือ ${product.stock} ชิ้น
                    </div>

                </div>

                <button
                    class="buy-btn"
                    onclick="buyProduct('${product.name}')"
                >
                    ดูสินค้า
                </button>

            </div>
        `;


        productList.appendChild(card);

    });

}


/* ================= LOGIN ================= */

async function loginUser(event) {

    event.preventDefault();


    const email =
        document.getElementById("login-email").value;

    const password =
        document.getElementById("login-password").value;

    const message =
        document.getElementById("login-message");


    message.textContent = "กำลังเข้าสู่ระบบ...";


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });


    if (error) {

        message.textContent =
            "อีเมลหรือรหัสผ่านไม่ถูกต้อง";

        message.style.color = "#ff1744";

        return;
    }


    message.textContent =
        "เข้าสู่ระบบสำเร็จ";

    message.style.color = "#4caf50";


    setTimeout(() => {

        window.location.href = "index.html";

    }, 800);

}


/* ================= REGISTER ================= */

async function registerUser(event) {

    event.preventDefault();


    const username =
        document.getElementById("register-username").value;

    const email =
        document.getElementById("register-email").value;

    const password =
        document.getElementById("register-password").value;

    const confirm =
        document.getElementById("register-confirm").value;

    const message =
        document.getElementById("register-message");


    if (password !== confirm) {

        message.textContent =
            "รหัสผ่านไม่ตรงกัน";

        message.style.color = "#ff1744";

        return;
    }


    message.textContent =
        "กำลังสร้างบัญชี...";


    const { data, error } =
        await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {
                    username: username
                }

            }

        });


    if (error) {

        message.textContent =
            error.message;

        message.style.color = "#ff1744";

        return;
    }


    message.textContent =
        "สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมล";

    message.style.color = "#4caf50";

}


/* ================= BUTTON ================= */

function buyProduct(name) {

    alert(
        "คุณเลือกสินค้า: " + name +
        "\nระบบตะกร้าจะเพิ่มในขั้นต่อไป"
    );

}


/* ================= EVENTS ================= */

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();


    const loginForm =
        document.getElementById("login-form");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            loginUser
        );

    }


    const registerForm =
        document.getElementById("register-form");

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            registerUser
        );

    }

});
