// Simple API testing utilities for admin dashboard

/**
 * Run a test against an API endpoint
 */
export const testEndpoint = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data,
      error: !response.ok ? data.error || 'Unknown error' : null,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      data: null,
      error: error instanceof Error ? error.message : 'Request failed',
    };
  }
};

/**
 * Test the stats API
 */
export const testStatsAPI = async () => {
  return testEndpoint('/api/admin/stats');
};

/**
 * Test the products API
 */
export const testProductsAPI = async () => {
  return testEndpoint('/api/products');
};

/**
 * Test the orders API
 */
export const testOrdersAPI = async () => {
  return testEndpoint('/api/orders');
};

/**
 * Test the users API
 */
export const testUsersAPI = async () => {
  return testEndpoint('/api/admin/users');
};

/**
 * Run all API tests
 */
export const runAllTests = async () => {
  const results = {
    stats: await testStatsAPI(),
    products: await testProductsAPI(),
    orders: await testOrdersAPI(),
    users: await testUsersAPI(),
  };
  
  // Format results for display
  const formattedResults = Object.entries(results).map(([name, result]) => ({
    name: `${name.charAt(0).toUpperCase() + name.slice(1)} API`,
    status: result.success ? 'success' : 'error',
    message: result.success 
      ? `Status: ${result.status} - Success` 
      : `Status: ${result.status} - ${result.error || 'Unknown error'}`,
    data: result.data
  }));
  
  return formattedResults;
};