import React, { useState } from 'react';
import { ShoppingCart, Package, Truck, RotateCcw, CreditCard, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  features: string[];
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export const EcommerceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'tracking' | 'returns'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [cart, setCart] = useState<Array<{ productId: string; quantity: number }>>([]);

  const products: Product[] = [
    {
      id: 'PROD-001',
      name: 'Fiber Installation Kit',
      description: 'Complete fiber optic installation package including all necessary cables, connectors, and mounting hardware.',
      price: 2500,
      image: '🔌',
      category: 'Installation',
      inStock: true,
      features: ['50m Fiber Cable', 'Wall Mount Kit', 'Power Supply', 'Installation Guide']
    },
    {
      id: 'PROD-002',
      name: 'WiFi 6 Router Upgrade',
      description: 'High-performance WiFi 6 router optimized for Bioniq\'s unrestricted internet service.',
      price: 1200,
      image: '📡',
      category: 'Hardware',
      inStock: true,
      features: ['WiFi 6 Technology', 'Gigabit Ethernet', 'MU-MIMO', '2-Year Warranty']
    },
    {
      id: 'PROD-003',
      name: 'Mesh Network Extender',
      description: 'Extend your WiFi coverage throughout your home with seamless roaming.',
      price: 800,
      image: '📶',
      category: 'Hardware',
      inStock: true,
      features: ['Seamless Roaming', 'Easy Setup', 'App Control', 'Covers 150m²']
    },
    {
      id: 'PROD-004',
      name: 'Business Internet Package',
      description: 'Dedicated business-grade internet with SLA guarantee and priority support.',
      price: 1500,
      image: '🏢',
      category: 'Service',
      inStock: true,
      features: ['Dedicated Line', 'SLA Guarantee', 'Priority Support', 'Static IP']
    },
    {
      id: 'PROD-005',
      name: 'Smart Home Bundle',
      description: 'Complete smart home setup with optimized network configuration for IoT devices.',
      price: 3500,
      image: '🏠',
      category: 'Bundle',
      inStock: false,
      features: ['Smart Hub', 'IoT Optimization', 'Security Setup', 'Device Management']
    }
  ];

  const sampleOrders: Order[] = [
    {
      id: 'BQ-2024-1205',
      date: '2024-12-05',
      status: 'delivered',
      items: [
        { productId: 'PROD-001', name: 'Fiber Installation Kit', quantity: 1, price: 2500 }
      ],
      total: 2500,
      trackingNumber: 'TRK-789456123',
      estimatedDelivery: '2024-12-07'
    },
    {
      id: 'BQ-2024-1201',
      date: '2024-12-01',
      status: 'shipped',
      items: [
        { productId: 'PROD-002', name: 'WiFi 6 Router Upgrade', quantity: 1, price: 1200 }
      ],
      total: 1200,
      trackingNumber: 'TRK-456789012',
      estimatedDelivery: '2024-12-08'
    },
    {
      id: 'BQ-2024-1128',
      date: '2024-11-28',
      status: 'confirmed',
      items: [
        { productId: 'PROD-003', name: 'Mesh Network Extender', quantity: 2, price: 800 }
      ],
      total: 1600
    }
  ];

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle2 className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const renderCatalog = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Product Catalog & Sales</h3>
        <p className="text-blue-700">
          Browse our complete range of internet hardware, installation services, and upgrade packages.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{product.image}</div>
              <h4 className="font-semibold text-gray-800">{product.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">R {product.price.toLocaleString()}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Features:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={() => addToCart(product.id)}
                disabled={!product.inStock}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Shopping Cart ({cart.length} items)</h4>
          <div className="flex items-center justify-between">
            <p className="text-green-700">Items added to cart successfully!</p>
            <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">Order Management</h3>
        <p className="text-green-700">
          Automated order notifications and real-time status updates for all your purchases.
        </p>
      </div>

      <div className="space-y-4">
        {sampleOrders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-800">Order #{order.id}</h4>
                <p className="text-sm text-gray-600">Placed on {order.date}</p>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium">R {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-semibold">Total: R {order.total.toLocaleString()}</span>
              {order.trackingNumber && (
                <div className="text-sm text-gray-600">
                  Tracking: <span className="font-mono">{order.trackingNumber}</span>
                </div>
              )}
            </div>
            
            {order.estimatedDelivery && (
              <div className="mt-2 text-sm text-blue-600">
                <MapPin className="w-4 h-4 inline mr-1" />
                Estimated delivery: {order.estimatedDelivery}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Order Notifications</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Order confirmation sent via WhatsApp</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Payment receipt delivered instantly</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Shipping notifications with tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Delivery confirmation with photos</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-800 mb-2">Real-Time Package Tracking</h3>
        <p className="text-purple-700">
          Track your packages in real-time with live location updates and delivery estimates.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Track Your Package</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Order Number or Tracking ID
              </label>
              <input
                type="text"
                placeholder="BQ-2024-1201 or TRK-456789012"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Track Package
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Live Tracking: BQ-2024-1201</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
              <div>
                <p className="font-medium text-sm">Package Shipped</p>
                <p className="text-xs text-gray-600">Dec 2, 2024 - 09:15 AM</p>
                <p className="text-xs text-gray-600">Johannesburg Distribution Center</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
              <div>
                <p className="font-medium text-sm">In Transit</p>
                <p className="text-xs text-gray-600">Dec 3, 2024 - 14:30 PM</p>
                <p className="text-xs text-gray-600">En route to Steve Tshwete</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
              <div>
                <p className="font-medium text-sm text-gray-500">Out for Delivery</p>
                <p className="text-xs text-gray-500">Expected: Dec 4, 2024</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Estimated Delivery</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">Tomorrow, Dec 4 between 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Tracking Features</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Real-time location updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">SMS and WhatsApp notifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Delivery time estimates</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Photo confirmation on delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Direct contact with courier</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Delivery reschedule options</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReturns = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-800 mb-2">Returns & Exchanges</h3>
        <p className="text-orange-700">
          Easy return and exchange process with automated guidance and prepaid shipping labels.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Initiate Return/Exchange</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select an order</option>
                <option value="BQ-2024-1205">BQ-2024-1205 - Fiber Installation Kit</option>
                <option value="BQ-2024-1201">BQ-2024-1201 - WiFi 6 Router Upgrade</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Return
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a reason</option>
                <option value="defective">Product defective/damaged</option>
                <option value="wrong-item">Wrong item received</option>
                <option value="not-compatible">Not compatible with setup</option>
                <option value="changed-mind">Changed mind</option>
                <option value="upgrade">Want to upgrade</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details
              </label>
              <textarea
                placeholder="Please describe the issue or reason for return..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
              Start Return Process
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Return Process</h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-sm">Submit Return Request</p>
                <p className="text-xs text-gray-600">Fill out the return form with reason and details</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-sm">Receive Return Label</p>
                <p className="text-xs text-gray-600">Prepaid shipping label sent via WhatsApp</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-sm">Package & Ship</p>
                <p className="text-xs text-gray-600">Pack item securely and drop off at courier</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">4</span>
              </div>
              <div>
                <p className="font-medium text-sm">Refund/Exchange</p>
                <p className="text-xs text-gray-600">Process completed within 3-5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <RotateCcw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h5 className="font-semibold text-blue-800">30-Day Returns</h5>
          <p className="text-sm text-blue-700">Full refund within 30 days</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h5 className="font-semibold text-green-800">Free Return Shipping</h5>
          <p className="text-sm text-green-700">Prepaid labels provided</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h5 className="font-semibold text-purple-800">Quick Refunds</h5>
          <p className="text-sm text-purple-700">3-5 business days</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Return Policy Highlights</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>30-day return window</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Original packaging not required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Free return shipping</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Exchange for different model</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Store credit option available</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Defective items replaced immediately</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'catalog', label: 'Product Catalog', icon: ShoppingCart },
    { id: 'orders', label: 'Order Management', icon: Package },
    { id: 'tracking', label: 'Package Tracking', icon: Truck },
    { id: 'returns', label: 'Returns & Exchanges', icon: RotateCcw }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">E-commerce & Order Management</h2>
        <p className="text-gray-600">
          Complete e-commerce solution with product catalog, order tracking, and automated customer notifications.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'catalog' && renderCatalog()}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'tracking' && renderTracking()}
      {activeTab === 'returns' && renderReturns()}
    </div>
  );
};