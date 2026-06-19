# Product Detail Screen - Agent Chunks
# Product list already bani hui hai — ab detail screen banani hai
# Yeh prompts ek ek karke agent ko do, pehla complete hone ke baad dosra do

---

## ✅ CHUNK 1 — Navigation Setup (Product List → Detail Screen)

```
Product list screen already bani hui hai.
Ab sirf navigation connect karna hai:

1. Create a new file: screens/ProductDetailScreen.js
   - Export default function ProductDetailScreen({ navigation, route })
   - Basic return: just a View with Text "Product Detail" for now
   - Use background color #F5F5F5

2. In the navigation stack (App.js or _layout.js):
   - Register ProductDetailScreen in the stack

3. In the existing product list screen:
   - Find the product card TouchableOpacity
   - Add onPress that navigates to ProductDetailScreen
   - Pass the full product object as route params:
     navigation.navigate('ProductDetailScreen', { product: item })

Do not build any UI in ProductDetailScreen yet.
Just confirm navigation works — clicking a product should open the new screen.
```

---

## ✅ CHUNK 2 — Dummy Data + States

```
In ProductDetailScreen.js, add dummy data at the top (outside component):

1. PRODUCT object:
   - id: '1'
   - name: 'Premium Wireless Headphones Pro Max'
   - originalPrice: 12000
   - discountedPrice: 9600
   - discountPercent: 20
   - stock: 15
   - rating: 4.5
   - reviewCount: 324
   - inStock: true
   - description: 'Experience crystal-clear sound with our Premium Wireless Headphones. 
     Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable 
     ear cushions. Perfect for music lovers and professionals.'
   - images: 4 URLs from https://picsum.photos/seed/p1/400/400 (change seed each time)
   - sizes: ['S', 'M', 'L', 'XL', 'XXL']
   - colors: ['#FF4747', '#333333', '#2563EB', '#10B981', '#F97316']
   - delivery: { time: '2-3 days', charge: 'Free', returnPolicy: '7 days return' }

2. REVIEWS array — 5 items each with:
   - id, name, avatar (picsum URL), rating (number 1-5),
     date (string), text (2 lines), photo (picsum URL or null)

3. RELATED_PRODUCTS array — 4 items each with:
   - id, name, price, image (picsum URL)

4. RATING_BREAKDOWN array:
   [{ stars: 5, count: 180 }, { stars: 4, count: 90 },
    { stars: 3, count: 30 }, { stars: 2, count: 15 }, { stars: 1, count: 9 }]

Inside the component, add these states:
- const [activeImage, setActiveImage] = useState(0)
- const [selectedSize, setSelectedSize] = useState('M')
- const [selectedColor, setSelectedColor] = useState('#FF4747')
- const [quantity, setQuantity] = useState(1)
- const [isWishlisted, setIsWishlisted] = useState(false)
- const [readMore, setReadMore] = useState(false)

Also get passed product from route if available:
const passedProduct = route?.params?.product
Use passedProduct data if available, otherwise use dummy PRODUCT object.
```

---

## ✅ CHUNK 3 — Top Bar + Image Slider

```
In ProductDetailScreen.js, replace the basic UI with proper layout.
Wrap everything in a View (flex:1, backgroundColor: #F5F5F5).

TOP BAR (not inside ScrollView):
- backgroundColor: #FF4747
- flexDirection: row, justifyContent: space-between, alignItems: center
- paddingTop: 44, paddingBottom: 12, paddingHorizontal: 16
- Left: TouchableOpacity with ← text, onPress: navigation.goBack()
- Center: Text "Product Detail" white, fontSize 17, fontWeight 700
- Right: two icons side by side:
    Share icon (⬆) onPress: Share.share({ message: product name + price })
    Cart icon (🛒)

Below TopBar, add a ScrollView (showsVerticalScrollIndicator={false}).
Inside ScrollView, first section is IMAGE SLIDER:

IMAGE SLIDER:
- Wrap in a View, backgroundColor white
- Horizontal ScrollView, pagingEnabled: true
- showsHorizontalScrollIndicator: false
- onScroll: setActiveImage(Math.round(e.nativeEvent.contentOffset.x / screenWidth))
- scrollEventThrottle: 16
- Each image: width = Dimensions.get('window').width, height: 320, resizeMode: cover

DOT INDICATORS below slider:
- flexDirection: row, justifyContent: center, paddingVertical: 10, gap: 6
- Active dot: backgroundColor #FF4747, width 20, height 8, borderRadius 4
- Inactive dot: backgroundColor #DDD, width 8, height 8, borderRadius 4

WISHLIST BUTTON (absolute inside image section):
- position: absolute, top: 14, right: 14
- White circle, padding 8, borderRadius 20, elevation 4
- Text ♥ — color #FF4747 if wishlisted, #CCC if not
- onPress: toggle isWishlisted

SALE BADGE (absolute inside image section):
- position: absolute, top: 14, left: 14
- backgroundColor: #FF4747, borderRadius 6, paddingHorizontal 10, paddingVertical 4
- White text: "20% OFF", fontWeight 700, fontSize 12
```

---

## ✅ CHUNK 4 — Product Info Card

```
In ProductDetailScreen.js, inside the main ScrollView,
below the image section add PRODUCT INFO card:

Card styles:
- backgroundColor: #FFFFFF
- marginHorizontal: 12, marginTop: 10
- borderRadius: 12, padding: 16
- elevation: 2

Inside the card:

1. PRODUCT NAME:
   - fontSize: 18, fontWeight: '700', color: #333
   - marginBottom: 10, lineHeight: 24

2. PRICE ROW (flexDirection: row, alignItems: center, gap: 10, marginBottom: 10):
   - Discounted price: fontSize 22, fontWeight 800, color #FF4747
   - Original price: fontSize 15, color #999, textDecorationLine: 'line-through'

3. RATING + STOCK ROW (flexDirection: row, alignItems: center, gap: 8, flexWrap: wrap):
   - Star rating: map [1,2,3,4,5] — show ★ character
     color #F97316 if i <= Math.round(rating), else #DDD
     fontSize: 16
   - Rating text: "4.5 (324 reviews)", fontSize 13, color #666
   - Stock badge (View):
     If inStock: backgroundColor #D1FAE5, text color #065F46, text "✓ In Stock"
     If not: backgroundColor #FEE2E2, text color #991B1B, text "✗ Out of Stock"
     paddingHorizontal 8, paddingVertical 3, borderRadius 6
     fontSize 12, fontWeight 600
```

---

## ✅ CHUNK 5 — Size, Color & Quantity

```
In ProductDetailScreen.js, inside main ScrollView,
add two cards below product info:

CARD 1 — SIZE & COLOR (same card style as before):

Size Selector:
- Label "Select Size": fontSize 15, fontWeight 700, marginBottom 10
- flexDirection: row, gap: 10, flexWrap: wrap
- For each size in ['S','M','L','XL','XXL']:
    TouchableOpacity, onPress: setSelectedSize(size)
    width: 48, height: 40, borderRadius: 8, borderWidth: 1.5
    If selected: backgroundColor #FF4747, borderColor #FF4747, text white
    If not: backgroundColor white, borderColor #DDD, text #555
    fontWeight 600, fontSize 13

Color Selector (marginTop: 14):
- Label "Select Color"
- flexDirection: row, gap: 12
- For each color in colors array:
    TouchableOpacity, onPress: setSelectedColor(color)
    width: 34, height: 34, borderRadius: 17, backgroundColor: color
    If selected: borderWidth 3, borderColor #333, scale 1.1 (use transform)

CARD 2 — QUANTITY (separate card):
- Label "Quantity"
- flexDirection: row, alignItems: center, gap: 14
- Minus button (−):
    width 36, height 36, borderRadius 18
    backgroundColor #F5F5F5, borderWidth 1, borderColor #DDD
    onPress: setQuantity(q => Math.max(1, q - 1))
    Text fontSize 20, fontWeight 600
- Quantity number: fontSize 18, fontWeight 700, minWidth 30, textAlign center
- Plus button (+):
    same style as minus
    onPress: setQuantity(q => Math.min(PRODUCT.stock, q + 1))
- Stock text: "15 left in stock", fontSize 12, color #888, marginLeft 8
```

---

## ✅ CHUNK 6 — Delivery Info + Description

```
In ProductDetailScreen.js, inside main ScrollView,
add two more cards:

CARD 1 — DELIVERY INFO:
- Label "Delivery Info"
- 3 rows, each: flexDirection row, alignItems center, gap 12, marginBottom 12

  Row 1: Text "🚚" (fontSize 22) | View with:
    Text "Estimated Delivery" (fontSize 12, color #888)
    Text "2-3 days" (fontSize 14, fontWeight 600, color #333)

  Row 2: Text "💰" | View with:
    Text "Delivery Charges"
    Text "Free" (color #10B981 green)

  Row 3: Text "🔄" | View with:
    Text "Return Policy"
    Text "7 days return"

CARD 2 — PRODUCT DESCRIPTION:
- Label "Product Description"
- Text component with product description:
    If readMore false: numberOfLines={3}
    If readMore true: no numberOfLines limit
    fontSize 14, color #555, lineHeight 22
- TouchableOpacity below text:
    If readMore false: Text "Read More ▼"
    If readMore true: Text "Read Less ▲"
    color #FF4747, fontWeight 600, fontSize 13, marginTop 8
    onPress: setReadMore(!readMore)
```

---

## ✅ CHUNK 7 — Ratings & Reviews

```
In ProductDetailScreen.js, inside main ScrollView,
add RATINGS & REVIEWS card:

Card label: "Ratings & Reviews"

1. AVERAGE RATING ROW (flexDirection row, alignItems center, gap 16, marginBottom 16):
   - Big number: fontSize 48, fontWeight 800, color #333
   - Right side View:
       Star icons (same ★ method, fontSize 20)
       Text "Based on 324 reviews" (color #888, fontSize 12, marginTop 4)

2. RATING BREAKDOWN (for each item in RATING_BREAKDOWN):
   Row: flexDirection row, alignItems center, gap 10, marginBottom 6
   - Label: "{stars} ★", fontSize 13, color #555, width 36
   - Progress bar container: flex 1, height 8, backgroundColor #F0F0F0, borderRadius 4, overflow hidden
     Inside: View with width = (count/324*100)%, height 100%, backgroundColor #F97316, borderRadius 4
   - Count: fontSize 12, color #888, width 30, textAlign right

3. CUSTOMER REVIEWS label: "Customer Reviews" (marginTop 16)
   For each review in REVIEWS array:
   - View with borderTopWidth 1, borderTopColor #F0F0F0, paddingTop 12, marginTop 12
   - Header row (flexDirection row, alignItems center, gap 10, marginBottom 8):
       Image: uri avatar, width 40, height 40, borderRadius 20
       View flex 1:
         Text name: fontSize 14, fontWeight 700, marginBottom 2
         Star rating (fontSize 12)
       Text date: fontSize 11, color #AAA
   - Review text: fontSize 13, color #555, lineHeight 20
   - If review.photo: Image uri, width 80, height 80, borderRadius 8, marginTop 8
```

---

## ✅ CHUNK 8 — Related Products + Fixed Action Buttons

```
In ProductDetailScreen.js, this is the final chunk.

RELATED PRODUCTS CARD (inside main ScrollView):
- Label "You May Also Like"
- Horizontal ScrollView, showsHorizontalScrollIndicator: false
- For each item in RELATED_PRODUCTS:
    TouchableOpacity, onPress: navigation.push('ProductDetailScreen', { product: item })
    width: 140, marginRight: 12
    backgroundColor: #F9F9F9, borderRadius: 10, overflow: hidden
    Image: width 140, height 120, resizeMode cover
    Text name: fontSize 12, fontWeight 600, color #333, padding 8, numberOfLines 2
    Text price: fontSize 13, color #FF4747, fontWeight 700, paddingHorizontal 8, paddingBottom 8

After related products, add:
- View height={100} (space so content not hidden behind action bar)

FIXED BOTTOM ACTION BAR (outside ScrollView, inside main View):
- position: absolute, bottom 0, left 0, right 0
- backgroundColor: white, borderTopWidth 1, borderTopColor #EEE
- padding: 16, flexDirection: row, gap: 12
- elevation: 10

Button 1 — ADD TO CART:
- flex: 1, backgroundColor: #FF4747, borderRadius: 10, paddingVertical: 14
- alignItems: center
- Text "🛒 Add to Cart", color white, fontWeight 700, fontSize 15
- onPress: Alert.alert('Added to Cart', quantity + ' item(s) added!')

Button 2 — BUY NOW:
- flex: 1, borderWidth: 2, borderColor: #FF4747, borderRadius: 10, paddingVertical: 14
- alignItems: center, backgroundColor: white
- Text "Buy Now", color #FF4747, fontWeight 700, fontSize 15
- onPress: Alert.alert('Buy Now', 'Proceeding to checkout...')

After this chunk, full Product Detail Screen is complete!
Test by clicking any product from the list.
```

---

## 📋 CHUNK ORDER SUMMARY

| Chunk | Kya banega |
|-------|-----------|
| Chunk 1 | Navigation connect (list → detail) |
| Chunk 2 | Dummy Data + States |
| Chunk 3 | Top Bar + Image Slider |
| Chunk 4 | Product Info Card |
| Chunk 5 | Size, Color, Quantity |
| Chunk 6 | Delivery Info + Description |
| Chunk 7 | Ratings & Reviews |
| Chunk 8 | Related Products + Action Buttons |

## ⚠️ IMPORTANT NOTES
- Product list already bani hai — Chunk 1 sirf navigation connect karega
- Har chunk ke baad agent ka kaam complete hone do, phir agla do
- Agar error aaye to pehle fix karwao
- Chunk 1 ke baad test karo — product click karne par screen open honi chahiye