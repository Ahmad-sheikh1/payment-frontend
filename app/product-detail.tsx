import React, { useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

// ── DUMMY DATA ───────────────────────────────────────────────────────────────

const PRODUCT = {
  id: 'default',
  name: 'Premium Wireless Headphones Pro Max',
  originalPrice: 12000,
  discountedPrice: 9600,
  discountPercent: 20,
  stock: 15,
  rating: 4.5,
  reviewCount: 324,
  inStock: true,
  description:
    'Experience crystal-clear sound with our Premium Wireless Headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions. Perfect for music lovers and professionals alike. The premium build quality ensures durability while the ergonomic design provides all-day comfort.',
  images: [
    'https://picsum.photos/seed/hp1a/400/400',
    'https://picsum.photos/seed/hp1b/400/400',
    'https://picsum.photos/seed/hp1c/400/400',
    'https://picsum.photos/seed/hp1d/400/400',
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: ['#FF4010', '#333333', '#2563EB', '#10B981', '#F97316'],
  delivery: {
    time: '2-3 days',
    charge: 'Free',
    returnPolicy: '7 days return',
  },
};

const MOCK_PRODUCTS: Record<string, typeof PRODUCT> = {
  '1': {
    id: '1',
    name: 'Premium Mechanical Keyboard RGB Backlit Gaming',
    originalPrice: 7999,
    discountedPrice: 2499,
    discountPercent: 69,
    stock: 15,
    rating: 4.8,
    reviewCount: 3241,
    inStock: true,
    description: 'Elevate your gaming and typing experience with our Premium Mechanical Keyboard. Featuring tactile mechanical switches, customizable RGB backlighting, and a solid build quality. Designed for endurance and peak performance.',
    images: [
      'https://picsum.photos/seed/kbd1/400/400',
      'https://picsum.photos/seed/kbd2/400/400',
      'https://picsum.photos/seed/kbd3/400/400',
      'https://picsum.photos/seed/kbd4/400/400',
    ],
    sizes: ['Blue Switch', 'Red Switch', 'Brown Switch'],
    colors: ['#1A1A1A', '#E5E5E5'],
    delivery: { time: '2-3 days', charge: 'Free', returnPolicy: '7 days return' },
  },
  '2': {
    id: '2',
    name: 'Minimalist Leather Wallet RFID Blocking Slim',
    originalPrice: 2299,
    discountedPrice: 849,
    discountPercent: 63,
    stock: 28,
    rating: 4.6,
    reviewCount: 1872,
    inStock: true,
    description: 'Crafted from premium genuine leather, this slim wallet features advanced RFID blocking technology to keep your cards secure. Fits up to 10 cards and cash comfortably without bulging.',
    images: [
      'https://picsum.photos/seed/wal1/400/400',
      'https://picsum.photos/seed/wal2/400/400',
      'https://picsum.photos/seed/wal3/400/400',
      'https://picsum.photos/seed/wal4/400/400',
    ],
    sizes: ['Standard'],
    colors: ['#3E2723', '#1A1A1A', '#4E342E'],
    delivery: { time: '3-4 days', charge: 'Free', returnPolicy: '7 days return' },
  },
  '3': {
    id: '3',
    name: 'Stainless Steel Water Bottle Insulated 1L',
    originalPrice: 3500,
    discountedPrice: 1199,
    discountPercent: 66,
    stock: 40,
    rating: 4.7,
    reviewCount: 6541,
    inStock: true,
    description: 'Double-walled vacuum insulated stainless steel water bottle keeps your drinks cold for 24 hours or hot for 12 hours. Durable powder coat finish with leak-proof cap.',
    images: [
      'https://picsum.photos/seed/bot1/400/400',
      'https://picsum.photos/seed/bot2/400/400',
      'https://picsum.photos/seed/bot3/400/400',
      'https://picsum.photos/seed/bot4/400/400',
    ],
    sizes: ['500ml', '750ml', '1000ml'],
    colors: ['#00838F', '#37474F', '#C62828', '#2E7D32'],
    delivery: { time: '2-3 days', charge: 'Free', returnPolicy: '7 days return' },
  },
  '4': {
    id: '4',
    name: 'USB-C Hub 7-in-1 Multi-port Adapter for Laptop',
    originalPrice: 4499,
    discountedPrice: 1649,
    discountPercent: 63,
    stock: 12,
    rating: 4.5,
    reviewCount: 2109,
    inStock: true,
    description: 'Expand your laptop with a 4K HDMI port, 3 USB 3.0 ports, SD/TF Card Readers, and a 100W Power Delivery pass-through charging port. Sleek aluminum alloy housing matches premium laptops.',
    images: [
      'https://picsum.photos/seed/hub1/400/400',
      'https://picsum.photos/seed/hub2/400/400',
      'https://picsum.photos/seed/hub3/400/400',
      'https://picsum.photos/seed/hub4/400/400',
    ],
    sizes: ['7-in-1', '9-in-1'],
    colors: ['#78909C', '#37474F'],
    delivery: { time: '2-3 days', charge: 'Free', returnPolicy: '7 days return' },
  },
  '5': {
    id: '5',
    name: 'Yoga Mat Non-Slip Thick Exercise Fitness',
    originalPrice: 3999,
    discountedPrice: 1399,
    discountPercent: 65,
    stock: 20,
    rating: 4.9,
    reviewCount: 8820,
    inStock: true,
    description: 'Premium eco-friendly TPE yoga mat with textured non-slip surface provides excellent traction and grip. 6mm optimal thickness offers superior cushioning and joint support.',
    images: [
      'https://picsum.photos/seed/mat1/400/400',
      'https://picsum.photos/seed/mat2/400/400',
      'https://picsum.photos/seed/mat3/400/400',
      'https://picsum.photos/seed/mat4/400/400',
    ],
    sizes: ['6mm Regular', '8mm Extra Thick'],
    colors: ['#6A1B9A', '#00695C', '#AD1457'],
    delivery: { time: '3-5 days', charge: 'Free', returnPolicy: '7 days return' },
  },
  '6': {
    id: '6',
    name: 'Wireless Charging Pad 15W Fast Charge',
    originalPrice: 1999,
    discountedPrice: 799,
    discountPercent: 60,
    stock: 18,
    rating: 4.4,
    reviewCount: 953,
    inStock: true,
    description: 'Super slim 15W Qi-certified wireless charging pad with intelligent temperature controls. Anti-slip rubber rings on top and bottom keep your device secure.',
    images: [
      'https://picsum.photos/seed/chg1/400/400',
      'https://picsum.photos/seed/chg2/400/400',
      'https://picsum.photos/seed/chg3/400/400',
      'https://picsum.photos/seed/chg4/400/400',
    ],
    sizes: ['Standard'],
    colors: ['#1A1A1A', '#FFFFFF'],
    delivery: { time: '2-3 days', charge: '₨150', returnPolicy: '7 days return' },
  },
  '7': {
    id: '7',
    name: 'Portable Bluetooth Speaker Waterproof IPX7',
    originalPrice: 5999,
    discountedPrice: 1999,
    discountPercent: 67,
    stock: 8,
    rating: 4.7,
    reviewCount: 4412,
    inStock: true,
    description: 'IPX7 waterproof portable speaker delivers rich bass and clear 360-degree sound. Features 24-hour playtime and a rugged exterior design perfect for outdoor adventures.',
    images: [
      'https://picsum.photos/seed/spk1/400/400',
      'https://picsum.photos/seed/spk2/400/400',
      'https://picsum.photos/seed/spk3/400/400',
      'https://picsum.photos/seed/spk4/400/400',
    ],
    sizes: ['Standard'],
    colors: ['#C62828', '#1A1A1A', '#1565C0'],
    delivery: { time: '2-3 days', charge: 'Free', returnPolicy: '7 days return' },
  },
  '8': {
    id: '8',
    name: 'Resistance Bands Set Workout Exercise Home Gym',
    originalPrice: 1499,
    discountedPrice: 599,
    discountPercent: 60,
    stock: 35,
    rating: 4.6,
    reviewCount: 7123,
    inStock: true,
    description: 'Set of 5 color-coded professional latex bands ranging from 10lbs to 50lbs. Includes foam handles, ankle straps, door anchor, and carrying bag for a complete home gym setup.',
    images: [
      'https://picsum.photos/seed/bnd1/400/400',
      'https://picsum.photos/seed/bnd2/400/400',
      'https://picsum.photos/seed/bnd3/400/400',
      'https://picsum.photos/seed/bnd4/400/400',
    ],
    sizes: ['Full Set (11pcs)'],
    colors: ['#FFC107'],
    delivery: { time: '2-4 days', charge: 'Free', returnPolicy: '7 days return' },
  },
  'deal_1': {
    id: 'deal_1',
    name: 'Wireless Earbuds Pro',
    originalPrice: 4500,
    discountedPrice: 999,
    discountPercent: 78,
    stock: 10,
    rating: 4.5,
    reviewCount: 423,
    inStock: true,
    description: 'Experience true wireless freedom with our Wireless Earbuds Pro. Featuring touch controls, premium active noise cancellation, and a pocket-friendly smart charging case.',
    images: [
      'https://picsum.photos/seed/deal1/400/400',
      'https://picsum.photos/seed/deal1b/400/400',
    ],
    sizes: ['Standard'],
    colors: ['#FFFFFF', '#1A1A1A'],
    delivery: { time: '2-3 days', charge: 'Free', returnPolicy: '7 days return' },
  },
  'deal_2': {
    id: 'deal_2',
    name: 'Smart Watch Ultra',
    originalPrice: 8900,
    discountedPrice: 1999,
    discountPercent: 77,
    stock: 12,
    rating: 4.7,
    reviewCount: 812,
    inStock: true,
    description: 'Advanced sports tracker smartwatch with always-on AMOLED display, built-in GPS, heart rate monitor, sleep tracking, and up to 10 days of battery life.',
    images: [
      'https://picsum.photos/seed/deal2/400/400',
      'https://picsum.photos/seed/deal2b/400/400',
    ],
    sizes: ['44mm', '49mm'],
    colors: ['#FFA726', '#37474F', '#78909C'],
    delivery: { time: '2-3 days', charge: 'Free', returnPolicy: '7 days return' },
  },
  'deal_3': {
    id: 'deal_3',
    name: 'LED Desk Lamp',
    originalPrice: 2900,
    discountedPrice: 799,
    discountPercent: 72,
    stock: 15,
    rating: 4.6,
    reviewCount: 310,
    inStock: true,
    description: 'Modern LED desk lamp with 5 brightness levels and 3 color modes. Features a USB charging port, touch controls, and a fully adjustable folding arm.',
    images: [
      'https://picsum.photos/seed/deal3/400/400',
      'https://picsum.photos/seed/deal3b/400/400',
    ],
    sizes: ['Standard'],
    colors: ['#FFFFFF', '#1A1A1A'],
    delivery: { time: '3-4 days', charge: 'Free', returnPolicy: '7 days return' },
  },
  'deal_4': {
    id: 'deal_4',
    name: 'Portable Charger 20000mAh',
    originalPrice: 3900,
    discountedPrice: 1299,
    discountPercent: 67,
    stock: 22,
    rating: 4.8,
    reviewCount: 1450,
    inStock: true,
    description: 'High-capacity 20000mAh external battery power bank. Equipped with dual USB-A ports and a USB-C port for fast charging multiple devices simultaneously.',
    images: [
      'https://picsum.photos/seed/deal4/400/400',
      'https://picsum.photos/seed/deal4b/400/400',
    ],
    sizes: ['20000mAh'],
    colors: ['#1A1A1A', '#FFFFFF'],
    delivery: { time: '2-3 days', charge: 'Free', returnPolicy: '7 days return' },
  },
};

const REVIEWS = [
  {
    id: '1',
    name: 'Ahmed Khan',
    avatar: 'https://picsum.photos/seed/rv1/80/80',
    rating: 5,
    date: '2 days ago',
    text: 'Excellent quality! The sound is crystal clear and noise cancellation works perfectly. Highly recommended for anyone looking for premium audio experience!',
    photo: null,
  },
  {
    id: '2',
    name: 'Fatima Hassan',
    avatar: 'https://picsum.photos/seed/rv2/80/80',
    rating: 4,
    date: '1 week ago',
    text: 'Great headphones at this price point. Battery lasts a long time and they are very comfortable. Only minor issue is connectivity sometimes drops.',
    photo: 'https://picsum.photos/seed/rvp2/120/120',
  },
  {
    id: '3',
    name: 'Ali Raza',
    avatar: 'https://picsum.photos/seed/rv3/80/80',
    rating: 5,
    date: '2 weeks ago',
    text: 'Best purchase I made this year! Comfortable fit, amazing sound quality, and the build feels super premium. Worth every penny.',
    photo: null,
  },
  {
    id: '4',
    name: 'Sara Malik',
    avatar: 'https://picsum.photos/seed/rv4/80/80',
    rating: 4,
    date: '3 weeks ago',
    text: 'Very good product. Works exactly as described. Packaging was great too. Will definitely buy again from this seller!',
    photo: null,
  },
  {
    id: '5',
    name: 'Omar Abdullah',
    avatar: 'https://picsum.photos/seed/rv5/80/80',
    rating: 3,
    date: '1 month ago',
    text: 'Good quality but slightly pricey. Performance is solid though I expected even better noise cancellation at this price range.',
    photo: null,
  },
];

const RELATED_PRODUCTS = [
  { id: '2', name: 'Bluetooth Speaker Pro', price: '₨4,500', image: 'https://picsum.photos/seed/rel1/200/200' },
  { id: '3', name: 'Wireless Earbuds Max', price: '₨6,999', image: 'https://picsum.photos/seed/rel2/200/200' },
  { id: '4', name: 'Studio Monitor Headset', price: '₨15,999', image: 'https://picsum.photos/seed/rel3/200/200' },
  { id: '5', name: 'Bass Boost Headphones', price: '₨7,999', image: 'https://picsum.photos/seed/rel4/200/200' },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 180 },
  { stars: 4, count: 90 },
  { stars: 3, count: 30 },
  { stars: 2, count: 15 },
  { stars: 1, count: 9 },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? '#F97316' : '#DDD' }}>★</Text>
      ))}
    </View>
  );
}

// ── SCREEN ───────────────────────────────────────────────────────────────────

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const productId = (params.productId as string) || '1';
  const product = MOCK_PRODUCTS[productId] || PRODUCT;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [readMore, setReadMore] = useState(false);

  useEffect(() => {
    setActiveImage(0);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0]);
    setQuantity(1);
    setIsWishlisted(false);
    setReadMore(false);
  }, [product.id, product.colors, product.sizes]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${product.name} — ₨${product.discountedPrice.toLocaleString()}`,
        title: product.name,
      });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4010" />

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.topBtn}>
          <Text style={styles.topBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Product Detail</Text>
        <View style={styles.topRightIcons}>
          <TouchableOpacity onPress={handleShare} style={styles.topBtn}>
            <Text style={styles.topBtnText}>⬆</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn}>
            <Text style={styles.topBtnText}>🛒</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── MAIN SCROLL ── */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

        {/* IMAGE SLIDER */}
        <View style={styles.sliderWrap}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setActiveImage(index);
            }}
          >
            {product.images.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={{ width: screenWidth, height: 320 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Sale Badge */}
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>{product.discountPercent}% OFF</Text>
          </View>

          {/* Wishlist Button */}
          <TouchableOpacity style={styles.wishlistBtn} onPress={() => setIsWishlisted(!isWishlisted)}>
            <Text style={[styles.wishlistIcon, { color: isWishlisted ? '#FF4010' : '#CCC' }]}>♥</Text>
          </TouchableOpacity>
        </View>

        {/* DOT INDICATORS */}
        <View style={styles.dotsRow}>
          {product.images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeImage ? '#FF4010' : '#DDD',
                  width: i === activeImage ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* ── PRODUCT INFO CARD ── */}
        <View style={styles.card}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.discountedPrice}>₨{product.discountedPrice.toLocaleString()}</Text>
            <Text style={styles.originalPrice}>₨{product.originalPrice.toLocaleString()}</Text>
          </View>

          <View style={styles.ratingStockRow}>
            <StarRow rating={product.rating} />
            <Text style={styles.ratingText}>{product.rating} ({product.reviewCount} reviews)</Text>
            <View style={[styles.stockBadge, { backgroundColor: product.inStock ? '#D1FAE5' : '#FEE2E2' }]}>
              <Text style={[styles.stockBadgeText, { color: product.inStock ? '#065F46' : '#991B1B' }]}>
                {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── SIZE & COLOR CARD ── */}
        <View style={styles.card}>
          <Text style={styles.selectorLabel}>Select Size</Text>
          <View style={styles.sizeGrid}>
            {product.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeBtn,
                  {
                    backgroundColor: selectedSize === size ? '#FF4010' : '#FFFFFF',
                    borderColor: selectedSize === size ? '#FF4010' : '#DDD',
                  },
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[styles.sizeBtnText, { color: selectedSize === size ? '#FFFFFF' : '#555' }]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.selectorLabel, { marginTop: 16 }]}>Select Color</Text>
          <View style={styles.colorGrid}>
            {product.colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorBtn,
                  {
                    backgroundColor: color,
                    borderWidth: selectedColor === color ? 3 : 0,
                    borderColor: selectedColor === color ? '#333' : 'transparent',
                    transform: [{ scale: selectedColor === color ? 1.12 : 1 }],
                  },
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        {/* ── QUANTITY CARD ── */}
        <View style={styles.card}>
          <Text style={styles.selectorLabel}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNum}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.stockText}>{product.stock} left in stock</Text>
          </View>
        </View>

        {/* ── DELIVERY INFO CARD ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Delivery Info</Text>

          {[
            { icon: '🚚', label: 'Estimated Delivery', value: product.delivery.time, valueColor: '#333' },
            { icon: '💰', label: 'Delivery Charges', value: product.delivery.charge, valueColor: '#10B981' },
            { icon: '🔄', label: 'Return Policy', value: product.delivery.returnPolicy, valueColor: '#333' },
          ].map((row) => (
            <View key={row.label} style={styles.deliveryRow}>
              <Text style={styles.deliveryEmoji}>{row.icon}</Text>
              <View>
                <Text style={styles.deliveryLabel}>{row.label}</Text>
                <Text style={[styles.deliveryValue, { color: row.valueColor }]}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── DESCRIPTION CARD ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Product Description</Text>
          <Text
            style={styles.descriptionText}
            numberOfLines={readMore ? undefined : 3}
          >
            {product.description}
          </Text>
          <TouchableOpacity onPress={() => setReadMore(!readMore)} style={{ marginTop: 8 }}>
            <Text style={styles.readMoreBtn}>{readMore ? 'Read Less ▲' : 'Read More ▼'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── RATINGS & REVIEWS CARD ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Ratings & Reviews</Text>

          {/* Average Rating */}
          <View style={styles.avgRatingRow}>
            <Text style={styles.avgRatingNum}>{product.rating.toFixed(1)}</Text>
            <View>
              <StarRow rating={product.rating} size={22} />
              <Text style={styles.basedOnText}>Based on {product.reviewCount} reviews</Text>
            </View>
          </View>

          {/* Rating Breakdown */}
          {RATING_BREAKDOWN.map((item) => (
            <View key={item.stars} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>{item.stars} ★</Text>
              <View style={styles.breakdownTrack}>
                <View
                  style={[
                    styles.breakdownFill,
                    { width: `${(item.count / product.reviewCount) * 100}%` as any },
                  ]}
                />
              </View>
              <Text style={styles.breakdownCount}>{item.count}</Text>
            </View>
          ))}

          {/* Customer Reviews */}
          <Text style={[styles.cardLabel, { marginTop: 18 }]}>Customer Reviews</Text>

          {REVIEWS.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <StarRow rating={review.rating} size={12} />
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
              {review.photo && (
                <Image source={{ uri: review.photo }} style={styles.reviewPhoto} />
              )}
            </View>
          ))}
        </View>

        {/* ── RELATED PRODUCTS CARD ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>You May Also Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {RELATED_PRODUCTS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.relatedItem}
                onPress={() => router.push({ pathname: '/product-detail', params: { productId: item.id } })}
                activeOpacity={0.85}
              >
                <Image source={{ uri: item.image }} style={styles.relatedImg} />
                <Text style={styles.relatedName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.relatedPrice}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacer for action bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── FIXED BOTTOM ACTION BAR ── */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => Alert.alert('Added to Cart', `${quantity} item(s) added!`)}
          activeOpacity={0.85}
        >
          <Text style={styles.addToCartText}>🛒 Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowBtn}
          onPress={() => router.push({
            pathname: '/checkout',
            params: {
              productId: product.id,
              quantity: quantity.toString(),
              size: selectedSize,
              color: selectedColor,
            }
          })}
          activeOpacity={0.85}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  // Top Bar
  topBar: {
    backgroundColor: '#FF4010',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  topBtn: {
    padding: 4,
  },
  topBtnText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topRightIcons: {
    flexDirection: 'row',
    gap: 14,
  },
  scrollView: {
    flex: 1,
  },
  // Image Slider
  sliderWrap: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  saleBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#FF4010',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 10,
  },
  saleBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
  },
  wishlistIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 4,
    padding: 16,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 10,
    lineHeight: 24,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 10,
  },
  discountedPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF4010',
  },
  originalPrice: {
    fontSize: 15,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  ratingStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  ratingText: {
    fontSize: 13,
    color: '#666666',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Size & Color
  selectorLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 10,
  },
  sizeGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  sizeBtn: {
    width: 48,
    height: 40,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeBtnText: {
    fontWeight: '600',
    fontSize: 13,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  colorBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  // Quantity
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  qtyNum: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    minWidth: 30,
    textAlign: 'center',
  },
  stockText: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 4,
  },
  // Delivery
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  deliveryEmoji: {
    fontSize: 22,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 2,
  },
  deliveryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Description
  descriptionText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
  },
  readMoreBtn: {
    color: '#FF4010',
    fontWeight: '600',
    fontSize: 13,
  },
  // Ratings
  avgRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avgRatingNum: {
    fontSize: 48,
    fontWeight: '800',
    color: '#333333',
  },
  basedOnText: {
    color: '#888888',
    fontSize: 12,
    marginTop: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#555555',
    width: 36,
  },
  breakdownTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: 4,
  },
  breakdownCount: {
    fontSize: 12,
    color: '#888888',
    width: 30,
    textAlign: 'right',
  },
  // Reviews
  reviewItem: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 11,
    color: '#AAAAAA',
  },
  reviewText: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
  },
  reviewPhoto: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginTop: 8,
  },
  // Related Products
  relatedItem: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  relatedImg: {
    width: 140,
    height: 120,
    backgroundColor: '#E5E5E5',
  },
  relatedName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    padding: 8,
    paddingBottom: 4,
  },
  relatedPrice: {
    fontSize: 13,
    color: '#FF4010',
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  // Action Bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 10,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: '#FF4010',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  buyNowBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#FF4010',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  buyNowText: {
    color: '#FF4010',
    fontWeight: '700',
    fontSize: 15,
  },
});
