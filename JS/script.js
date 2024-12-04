// LocalStorage
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Ícone
function updateLoginStatus() {
    const loginIcon = document.getElementById("login-icon");
    if (currentUser) {
        loginIcon.textContent = "👤"; 
        loginIcon.onclick = () => {
            if (confirm("Deseja sair da sua conta?")) {
                localStorage.removeItem("currentUser"); 
                currentUser = null;
                location.reload(); 
            }
        };
    } else {
        loginIcon.textContent = "Login"; 
        loginIcon.href = "HTML/login.html"; 
    }
}

// Login
function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(username)); 
        currentUser = username;
        location.href = "index.html"; 
    } else {
        alert("Usuário ou senha incorretos."); 
    }
}

// Registro
function registerUser(username, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.username === username)) {
        alert("Usuário já existe."); 
        return;
    }
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users)); 
    localStorage.setItem("currentUser", JSON.stringify(username)); 
    currentUser = username;
    location.href = "index.html"; 
}

// Formulário Login/Cadastro
function handleAuth(event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const submitButton = event.target.querySelector("button");
    if (submitButton.textContent === "Entrar") {
        loginUser(username, password); 
    } else {
        registerUser(username, password); 
    }
}

// Troca formulário Login/Cadastro
function toggleForm(event) {
    event.preventDefault();
    const submitButton = document.getElementById("submit-btn");
    if (submitButton.textContent === "Entrar") {
        submitButton.textContent = "Cadastrar";
        document.getElementById("toggle-btn").textContent = "Já tem conta? Faça login.";
    } else {
        submitButton.textContent = "Entrar";
        document.getElementById("toggle-btn").textContent = "Não tem conta? Cadastre-se.";
    }
}

// Renderizar produtos página inicial
function renderProducts() {
    const products = [
        { id: 1, name: "Bolo de Chocolate", price: 90.00, image: "IMG/menu/bolo1.jpg", category: "filter-starters" },
        { id: 2, name: "Bolo de Morango", price: 85.00, image: "IMG/menu/bolo2.jpg", category: "filter-starters" },
        { id: 3, name: "Bolo de ninho", price: 100.00, image: "IMG/menu/bolo3.jpg", category: "filter-starters" },
        { id: 4, name: "Bolo de pote Morango", price: 15.00, image: "IMG/menu/bolo_pote1.jpg", category: "filter-specialty" },
        { id: 5, name: "Bolo de pote morango e ninho", price: 15.00, image: "IMG/menu/bolo_pote2.jpg", category: "filter-specialty" },
        { id: 6, name: "Bolo de pote limão", price: 15.00, image: "IMG/menu/bolo_pote3.jpg", category: "filter-specialty" },
        { id: 7, name: "Beijinho", price: 15.00, image: "IMG/menu/doce1.jpg", category: "filter-salads" },
        { id: 8, name: "Bicho de pé", price: 15.00, image: "IMG/menu/doce2.jpg", category: "filter-salads" },
        { id: 9, name: "Brigadeiro", price: 15.00, image: "IMG/menu/doce3.jpg", category: "filter-salads" }
    ];

    const productContainer = document.getElementById("product-container");  
    productContainer.innerHTML = ""; 

    const categories = ["filter-starters", "filter-specialty", "filter-salads"];
    
    categories.forEach((category) => {
        const filterDiv = document.createElement("div");
        filterDiv.classList.add("row", category); 

        const filteredProducts = products.filter((product) => product.category === category);

        filteredProducts.forEach((product) => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("col-lg-4", "menu-item", "isotope-item", category);

            productDiv.innerHTML = `
                <img src="${product.image}" class="menu-img" alt="${product.name}">
                <div class="menu-content">
                    <a href="#">${product.name}</a><span>R$ ${product.price.toFixed(2)}</span>
                </div>
                <div class="menu-ingredients">
                    Delicioso ${product.name.toLowerCase()}
                </div>
                <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            `;

            filterDiv.appendChild(productDiv);
        });

        productContainer.appendChild(filterDiv);
    });
}


// Adicionar produtos no carrinho
function addToCart(productId) {
    if (!currentUser) {
        alert("Você precisa estar logado para adicionar produtos ao carrinho.");
        location.href = "HTML/login.html";
        return;
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const selectedProduct = products.find((product) => product.id === productId);
    if (!selectedProduct) return;

    let cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
    cart.push(selectedProduct);
    localStorage.setItem(`${currentUser}_cart`, JSON.stringify(cart));

    updateCartCount();
    updateCartPreview();
}

// Contagem Carrinho
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    const cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
    cartCount.textContent = cart.length;
}

// Era para mostrar uma prévia do carrinho
function updateCartPreview() {
    const cartPreview = document.getElementById("cart-preview");
    if (!cartPreview) return;

    const cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
    cartPreview.innerHTML = ""; 

    if (cart.length === 0) {
        cartPreview.innerHTML = "<p>Seu carrinho está vazio.</p>";
        return;
    }

    cart.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("cart-item");
        productDiv.innerHTML = `
            <p>${product.name} - R$ ${product.price.toFixed(2)}</p>
        `;
        cartPreview.appendChild(productDiv);
    });
}

// Redireciona para a página do carrinho
function goToCart() {
    location.href = "HTML/carrinho.html";
}

// Inicialização da página de login
if (document.location.pathname.includes("HTML/login.html")) {
    document.getElementById("auth-form").addEventListener("submit", handleAuth);
    document.getElementById("toggle-btn").addEventListener("click", toggleForm);
}

// Inicialização da página de produtos
if (document.location.pathname.includes("index.html")) {
    updateLoginStatus();
    renderProducts();
    updateCartCount();

    const cartIcon = document.getElementById("cart-icon");
    cartIcon.addEventListener("mouseenter", updateCartPreview);
    cartIcon.addEventListener("click", goToCart);
}

// Inicialização da página do carrinho
if (document.location.pathname.includes("HTML/carrinho.html")) {
    const cartItems = document.getElementById("cart-items");
    const cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");

    cartItems.innerHTML = ""; 

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
        let total = 0;

        cart.forEach(product => {
            total += product.price;
            const productDiv = document.createElement("div");
            productDiv.classList.add("cart-item");
            productDiv.innerHTML = `
                <p>${product.name} - R$ ${product.price.toFixed(2)}</p>
            `;
            cartItems.appendChild(productDiv);
        });

        const totalDiv = document.createElement("div");
        totalDiv.innerHTML = `<h3>Total: R$ ${total.toFixed(2)}</h3>`;
        cartItems.appendChild(totalDiv);
    }

    document.querySelector("button").addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Adicione produtos ao carrinho antes de finalizar a compra.");
        } else {
            location.href = "HTML/pagamento.html";
        }
    });
}

// Calcular frete
function calculateFrete(cep) {
    if (/^\d{5}-\d{3}$/.test(cep)) {
        const shippingFee = (Math.random() * (50 - 10) + 10).toFixed(2);
        const total = parseFloat(localStorage.getItem("total-price"));
        const totalWithShipping = (total + parseFloat(shippingFee)).toFixed(2);

        document.getElementById("frete").textContent = `Frete: R$ ${shippingFee}`;
        document.getElementById("total-with-shipping").textContent = `R$ ${totalWithShipping}`;

        return shippingFee;
    } else {
        alert("CEP inválido.");
        return null;
    }
}

// Qr Code
function generatePixQRCode() {
    const qr = new QRious({
        element: document.getElementById("qr-code"),
        value: "https://api.qrserver.com/v1/create-qr-code/?data=PIX-EXEMPLO", 
        size: 200
    });
}

// Cartão Crédito/Débito
function showCreditDebitForm() {
    document.getElementById("credit-debit-section").style.display = "block";
    document.getElementById("pix-section").style.display = "none";
}

// Exibir Qr Code Pix
function showPixSection() {
    document.getElementById("credit-debit-section").style.display = "none";
    document.getElementById("pix-section").style.display = "block";
    generatePixQRCode(); 
}

// Verificar todos os campos Cartão Crédito/Débito
function isCardFormValid() {
    const cardName = document.getElementById("card-name").value;
    const cardNumber = document.getElementById("card-number").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const cvv = document.getElementById("cvv").value;

    return cardName && cardNumber && expiryDate && cvv;
}

// Atualização das informações de pagamento e resumo
if (document.location.pathname.includes("HTML/pagamento.html")) {
    const cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
    const total = cart.reduce((sum, product) => sum + product.price, 0);
    
    localStorage.setItem("total-price", total); 
    document.getElementById("total-price").textContent = `R$ ${total.toFixed(2)}`;

    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            const paymentMethod = this.value;
            if (paymentMethod === "pix") {
                showPixSection();
            } else if (paymentMethod === "credit-card" || paymentMethod === "debit-card") {
                showCreditDebitForm();
            }
        });
    });

    document.getElementById("calc-frete-btn").addEventListener("click", function() {
        const cep = document.getElementById("cep").value;
        calculateFrete(cep);
    });

    document.getElementById("finalize-purchase").addEventListener("click", function() {
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const shippingFee = calculateFrete(document.getElementById("cep").value);
        
        if (!shippingFee) return; 

        if ((selectedPaymentMethod === "credit-card" || selectedPaymentMethod === "debit-card") && !isCardFormValid()) {
            alert("Por favor, preencha todos os campos do cartão.");
            return;
        }

        setTimeout(() => {
            alert(`Compra finalizada com sucesso! Método de pagamento: ${selectedPaymentMethod.toUpperCase()}`);
            localStorage.removeItem(`${currentUser}_cart`); 
            location.href = "index.html"; 
        }, 1000);
    });
}