// Carrinho de compras
let cart = [];

// Adicionar ao carrinho
function addToCart(name, price, quantity) {
    cart.push({ name, price, quantity });
    updateCartCount();
    showNotification(`${name} adicionado ao carrinho!`);
}

// Atualizar contador do carrinho
function updateCartCount() {
    const count = cart.length;
    document.querySelector('.cart-count').textContent = count;
}

// Abrir carrinho
document.querySelector('.cart-icon').addEventListener('click', function() {
    displayCart();
    document.getElementById('cart-modal').style.display = 'block';
});

// Fechar carrinho
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Exibir carrinho
function displayCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';

    let subtotal = 0;
    let totalValue = 0;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: #666;">Seu carrinho está vazio</p>';
        document.getElementById('subtotal').textContent = 'R$ 0,00';
        document.getElementById('total').textContent = 'R$ 0,00';
        document.getElementById('savings').textContent = 'R$ 0,00';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Calcular economias baseado no tipo de pacote
        let savings = 0;
        if (item.quantity === 10) {
            savings = (item.price * 0.30); // 30% de economia
        } else if (item.quantity === 20) {
            savings = (item.price * 0.25); // 25% de economia
        }
        totalValue += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">R$ ${itemTotal.toFixed(2)}</span>
            <button class="remove-btn" onclick="removeFromCart(${index})">Remover</button>
        `;
        cartItemsDiv.appendChild(cartItem);
    });

    // Calcular economia total
    let totalSavings = 0;
    cart.forEach(item => {
        if (item.quantity === 10) {
            totalSavings += (item.price * 0.30);
        } else if (item.quantity === 20) {
            totalSavings += (item.price * 0.25);
        }
    });

    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('savings').textContent = `R$ ${totalSavings.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${(totalValue - totalSavings).toFixed(2)}`;
}

// Remover do carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    displayCart();
}

// Finalizar compra via WhatsApp
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let message = 'Olá! Gostaria de comprar os seguintes itens:\n\n';

    cart.forEach(item => {
        message += `${item.name} - Quantidade: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    let totalSavings = 0;
    cart.forEach(item => {
        if (item.quantity === 10) {
            totalSavings += (item.price * 0.30);
        } else if (item.quantity === 20) {
            totalSavings += (item.price * 0.25);
        }
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal - totalSavings;

    message += `\nEconomia: R$ ${totalSavings.toFixed(2)}`;
    message += `\nTotal: R$ ${total.toFixed(2)}`;

    // Abrir WhatsApp com mensagem
    const whatsappURL = `https://wa.me/55?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// Notificação
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #00AA44;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Fechar modal clicando fora
window.addEventListener('click', function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
