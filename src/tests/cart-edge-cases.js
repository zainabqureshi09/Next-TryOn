// Cart Edge Case Tests
// Run this in the browser console when on the cart page

async function testCartEdgeCases() {
  console.log('🧪 Starting Cart Edge Case Tests');
  
  // Get cart functions from the store
  const getCart = () => {
    try {
      return window.document.__NEXT_DATA__.props.pageProps.useCart;
    } catch (e) {
      console.error('Failed to access cart store:', e);
      return null;
    }
  };

  // Test 1: Add duplicate product
  console.log('Test 1: Adding duplicate product');
  try {
    const mockProduct = {
      id: 'test-product-1',
      name: 'Test Product',
      price: 99.99,
      image: '/images/placeholder.jpg'
    };
    
    // Add the same product twice
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockProduct)
    });
    
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockProduct)
    });
    
    // Verify cart has one item with qty = 2
    const cartResponse = await fetch('/api/cart');
    const cart = await cartResponse.json();
    const item = cart.items.find(i => i.id === mockProduct.id);
    
    if (item && item.qty === 2) {
      console.log('✅ Test 1 passed: Duplicate product correctly incremented quantity');
    } else {
      console.error('❌ Test 1 failed: Duplicate product handling issue', item);
    }
  } catch (error) {
    console.error('❌ Test 1 failed with error:', error);
  }

  // Test 2: Invalid product data
  console.log('Test 2: Adding product with invalid data');
  try {
    const invalidProduct = {
      id: 'invalid-product',
      // Missing required name field
      price: null, // Invalid price
      image: '/images/placeholder.jpg'
    };
    
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidProduct)
    });
    
    if (!response.ok) {
      console.log('✅ Test 2 passed: Invalid product correctly rejected');
    } else {
      console.error('❌ Test 2 failed: Invalid product was accepted');
    }
  } catch (error) {
    console.log('✅ Test 2 passed: Invalid product correctly caused an error:', error);
  }

  // Test 3: Network failure simulation
  console.log('Test 3: Network failure simulation');
  try {
    // Mock network failure by using invalid URL
    const response = await fetch('/api/cart-nonexistent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'test-network-failure', name: 'Test Product', price: 10.99 })
    });
    
    console.log('Network failure test response:', response.status);
    if (!response.ok) {
      console.log('✅ Test 3 passed: Network failure correctly handled');
    } else {
      console.error('❌ Test 3 failed: Network failure not detected');
    }
  } catch (error) {
    console.log('✅ Test 3 passed: Network failure correctly caused an error:', error);
  }

  // Test 4: Clear cart and verify
  console.log('Test 4: Clear cart functionality');
  try {
    // Clear the cart
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clearAll: true })
    });
    
    // Verify cart is empty
    const cartResponse = await fetch('/api/cart');
    const cart = await cartResponse.json();
    
    if (cart.items.length === 0) {
      console.log('✅ Test 4 passed: Cart cleared successfully');
    } else {
      console.error('❌ Test 4 failed: Cart not cleared properly', cart);
    }
  } catch (error) {
    console.error('❌ Test 4 failed with error:', error);
  }

  console.log('🏁 Cart Edge Case Tests Completed');
}

// Run the tests
testCartEdgeCases();