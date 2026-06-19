# Checkout Flow - Agent Chunks
# Buy Now → Checkout → Payment → Order Confirmation → Order Tracking
# Yeh prompts ek ek karke agent ko do

---

## ✅ CHUNK 1 — Navigation Setup

```
Add the following screens to the navigation stack (App.js or _layout.js):

1. CheckoutScreen
2. OrderConfirmationScreen  
3. OrderTrackingScreen

Create empty files for each in the screens folder:
- screens/CheckoutScreen.js
- screens/OrderConfirmationScreen.js
- screens/OrderTrackingScreen.js

Each file should export a default function with basic:
- View with backgroundColor #F5F5F5
- Text with screen name

In ProductDetailScreen.js:
- Find the "Buy Now" button
- Change its onPress to:
  navigation.navigate('CheckoutScreen')

Do not build any UI yet. Just confirm navigation works.
```

---

## ✅ CHUNK 2 — Checkout Screen: Dummy Data + States

```
In CheckoutScreen.js add the following:

DUMMY DATA (outside component):

1. SAVED_ADDRESSES array — 2 items:
   [
     { id: '1', name: 'Ahmed Khan', phone: '0311-1234567',
       city: 'Karachi', area: 'Gulshan-e-Iqbal',
       address: 'House #12, Block 5, Gulshan-e-Iqbal, Karachi' },
     { id: '2', name: 'Ahmed Khan', phone: '0311-1234567',
       city: 'Lahore', area: 'DHA Phase 6',
       address: 'Plot #45, Street 8, DHA Phase 6, Lahore' }
   ]

2. ORDER_ITEMS array — 2 items:
   [
     { id: '1', name: 'Premium Wireless Headphones Pro Max',
       image: 'https://picsum.photos/seed/p1/80/80',
       price: 9600, quantity: 1, size: 'M', color: '#FF4747' },
     { id: '2', name: 'Smart Watch Pro',
       image: 'https://picsum.photos/seed/p2/80/80',
       price: 8999, quantity: 2, size: 'L', color: '#333333' }
   ]

STATES (inside component):
- const [selectedAddress, setSelectedAddress] = useState('1')
- const [selectedPayment, setSelectedPayment] = useState('cod')
- const [showAddressForm, setShowAddressForm] = useState(false)
- const [newName, setNewName] = useState('')
- const [newPhone, setNewPhone] = useState('')
- const [newCity, setNewCity] = useState('')
- const [newArea, setNewArea] = useState('')
- const [newAddress, setNewAddress] = useState('')

CALCULATED VALUES:
- const subtotal = ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0)
- const deliveryCharge = 0 (Free)
- const discount = 500
- const total = subtotal + deliveryCharge - discount
```

---

## ✅ CHUNK 3 — Checkout Screen: Top Bar + Delivery Address

```
In CheckoutScreen.js, build the UI.
Wrap everything in View (flex:1, backgroundColor: #F5F5F5).

TOP BAR:
- backgroundColor: #FF4747
- flexDirection: row, alignItems: center, justifyContent: space-between
- paddingTop: 44, paddingBottom: 12, paddingHorizontal: 16
- Left: ← back button (white), onPress: navigation.goBack()
- Center: Text "Checkout" white, fontSize 17, fontWeight 700
- Right: empty View (for balance)

Below TopBar, add ScrollView (showsVerticalScrollIndicator: false).

SECTION 1 — DELIVERY ADDRESS (white card, margin 12, borderRadius 12, padding 16, elevation 2):

Header row (flexDirection row, justifyContent space-between, alignItems center, marginBottom 12):
- Text "Delivery Address" fontSize 15, fontWeight 700
- TouchableOpacity "+ Add New" color #FF4747, fontSize 13, fontWeight 600
  onPress: setShowAddressForm(!showAddressForm)

For each address in SAVED_ADDRESSES:
  TouchableOpacity onPress: setSelectedAddress(address.id)
  Row style: flexDirection row, alignItems flex-start, gap 12
  padding 12, borderRadius 10, borderWidth 1.5, marginBottom 8
  If selected: borderColor #FF4747, backgroundColor #FFF5F5
  If not: borderColor #EEE, backgroundColor white

  Left: Radio circle
    outer: width 20, height 20, borderRadius 10, borderWidth 2
    If selected: borderColor #FF4747, inner filled circle #FF4747
    If not: borderColor #CCC

  Right (flex 1):
    Name: fontWeight 700, fontSize 14, color #333
    Phone: fontSize 13, color #666, marginTop 2
    Full address: fontSize 12, color #888, marginTop 4, lineHeight 18

ADD NEW ADDRESS FORM (show only if showAddressForm is true):
  Below the address list, show a View with:
  - TextInput for Name (placeholder "Full Name")
  - TextInput for Phone (placeholder "Phone Number", keyboardType phone-pad)
  - TextInput for City (placeholder "City")
  - TextInput for Area (placeholder "Area / Block")
  - TextInput for Full Address (placeholder "Full Address", multiline, numberOfLines 3)
  Each TextInput: borderWidth 1, borderColor #DDD, borderRadius 8,
    padding 10, fontSize 14, marginBottom 10, backgroundColor white
  Save button: backgroundColor #FF4747, borderRadius 8, padding 12,
    Text "Save Address" white center fontWeight 700
```

---

## ✅ CHUNK 4 — Checkout Screen: Order Summary + Payment Method

```
In CheckoutScreen.js, inside ScrollView, below address section add:

SECTION 2 — ORDER SUMMARY (white card, same card style):

Label: "Order Summary" fontSize 15, fontWeight 700, marginBottom 12

For each item in ORDER_ITEMS:
  Row: flexDirection row, gap 12, marginBottom 12, 
       paddingBottom 12, borderBottomWidth 1, borderBottomColor #F0F0F0
  
  Image: width 70, height 70, borderRadius 8
  
  Right View (flex 1):
    Product name: fontSize 13, fontWeight 600, color #333, numberOfLines 2
    Size + Color row: Text "Size: M" + small color circle
    fontSize 12, color #888, marginTop 4
    
    Bottom row (justifyContent space-between):
      Text "Qty: 1" fontSize 12, color #888
      Text "Rs. 9,600" fontSize 14, fontWeight 700, color #FF4747

Price Summary (marginTop 8):
  Each row: flexDirection row, justifyContent space-between, marginBottom 8
  
  Row 1: Text "Subtotal" | Text "Rs. {subtotal}"
  Row 2: Text "Delivery" | Text "Free" (color #10B981)
  Row 3: Text "Discount" | Text "- Rs. 500" (color #10B981)
  
  Divider: height 1, backgroundColor #F0F0F0, marginVertical 8
  
  Total row: 
    Text "Total" fontSize 16, fontWeight 700
    Text "Rs. {total}" fontSize 16, fontWeight 800, color #FF4747

SECTION 3 — PAYMENT METHOD (white card, same style):

Label: "Payment Method" fontSize 15, fontWeight 700, marginBottom 12

4 payment options — for each, TouchableOpacity:
  flexDirection row, alignItems center, gap 12
  padding 14, borderRadius 10, borderWidth 1.5, marginBottom 10
  If selected: borderColor #FF4747, backgroundColor #FFF5F5
  If not: borderColor #EEE, backgroundColor white
  onPress: setSelectedPayment(value)

  Left: Radio circle (same as address)
  Middle (flex 1):
    Text payment name: fontWeight 600, fontSize 14
    Text description: fontSize 12, color #888
  Right: emoji icon

  Option 1: value='cod'
    Name: "Cash on Delivery"
    Description: "Pay when you receive"
    Icon: 💵

  Option 2: value='jazzcash'
    Name: "JazzCash"
    Description: "Pay via JazzCash wallet"
    Icon: 🔴

  Option 3: value='easypaisa'
    Name: "Easypaisa"
    Description: "Pay via Easypaisa wallet"
    Icon: 🟢

  Option 4: value='card'
    Name: "Credit / Debit Card"
    Description: "Visa, Mastercard accepted"
    Icon: 💳

Add View height={100} at bottom of ScrollView.
```

---

## ✅ CHUNK 5 — Checkout Screen: Place Order Button

```
In CheckoutScreen.js, outside the ScrollView but inside main View,
add FIXED BOTTOM BAR:

- position: absolute, bottom 0, left 0, right 0
- backgroundColor white, borderTopWidth 1, borderTopColor #EEE
- padding 16, elevation 10

Top row (flexDirection row, justifyContent space-between, marginBottom 12):
  Text "Total Amount" fontSize 14, color #888
  Text "Rs. {total}" fontSize 18, fontWeight 800, color #FF4747

Place Order button:
  backgroundColor: #FF4747, borderRadius 12, paddingVertical 15
  alignItems center
  Text "Place Order →" color white, fontSize 16, fontWeight 700
  onPress: navigation.navigate('OrderConfirmationScreen', {
    orderId: 'ORD-' + Math.floor(Math.random() * 900000 + 100000),
    total: total,
    paymentMethod: selectedPayment,
    address: SAVED_ADDRESSES.find(a => a.id === selectedAddress)
  })
```

---

## ✅ CHUNK 6 — Order Confirmation Screen

```
In OrderConfirmationScreen.js, build the full screen.
Get data from route.params: { orderId, total, paymentMethod, address }

FULL SCREEN UI (no scroll needed, flex 1, backgroundColor #F5F5F5,
alignItems center, justifyContent center, padding 24):

1. SUCCESS ANIMATION (top center):
   - Big green circle: width 100, height 100, borderRadius 50
     backgroundColor #D1FAE5, alignItems center, justifyContent center
   - Inside: Text "✓" fontSize 48, color #065F46, fontWeight 800

2. SUCCESS TEXT (marginTop 20):
   - "Order Placed!" fontSize 26, fontWeight 800, color #333, textAlign center
   - "Your order has been placed successfully." 
     fontSize 14, color #888, textAlign center, marginTop 8

3. ORDER DETAILS CARD (white card, width 100%, borderRadius 12,
   padding 16, marginTop 24, elevation 2):
   
   Each row: flexDirection row, justifyContent space-between, marginBottom 12
   
   Row 1: Text "Order ID" color #888 | Text orderId fontWeight 700 color #333
   Row 2: Text "Total Amount" color #888 | Text "Rs. {total}" fontWeight 700 color #FF4747
   Row 3: Text "Payment" color #888 | Text paymentMethod (show full name) fontWeight 600
   Row 4: Text "Delivery" color #888 | Text "2-3 Business Days" fontWeight 600
   Row 5: Text "Address" color #888 | Text address.city + ", " + address.area
           fontWeight 600, textAlign right, flex 1, marginLeft 16

4. ESTIMATED DELIVERY (marginTop 16):
   - Small box: backgroundColor #FFF5F5, borderRadius 8, padding 12
   - Row: Text "🚚 Estimated Delivery:" | Text "Mon, Jun 16 - Wed, Jun 18"
   - fontSize 13, color #555

5. TWO BUTTONS (marginTop 24, width 100%, gap 12):
   
   Button 1 — TRACK ORDER:
   - backgroundColor #FF4747, borderRadius 12, paddingVertical 14
   - Text "📦 Track Order" white, fontWeight 700, fontSize 15, textAlign center
   - onPress: navigation.navigate('OrderTrackingScreen', { orderId: orderId })

   Button 2 — CONTINUE SHOPPING:
   - borderWidth 2, borderColor #FF4747, borderRadius 12, paddingVertical 14
   - Text "Continue Shopping" color #FF4747, fontWeight 700, textAlign center
   - onPress: navigation.navigate('Home') or navigation.popToTop()
```

---

## ✅ CHUNK 7 — Order Tracking Screen

```
In OrderTrackingScreen.js, build the full screen.
Get orderId from route.params.

DUMMY TRACKING DATA (inside component):
const TRACKING_STEPS = [
  { id: 1, title: 'Order Placed', description: 'Your order has been received',
    time: 'Today, 2:30 PM', completed: true },
  { id: 2, title: 'Order Confirmed', description: 'Seller confirmed your order',
    time: 'Today, 3:00 PM', completed: true },
  { id: 3, title: 'Processing', description: 'Your order is being prepared',
    time: 'Today, 4:00 PM', completed: true },
  { id: 4, title: 'Shipped', description: 'Order handed to delivery partner',
    time: 'Tomorrow, 10:00 AM', completed: false },
  { id: 5, title: 'Out for Delivery', description: 'Rider is on the way',
    time: 'Tomorrow, 2:00 PM', completed: false },
  { id: 6, title: 'Delivered', description: 'Package delivered successfully',
    time: 'Tomorrow, 4:00 PM', completed: false },
]

TOP BAR:
- backgroundColor #FF4747
- Left: ← back button
- Center: "Track Order" white bold
- paddingTop 44

ScrollView below:

CARD 1 — ORDER INFO (white card margin 12 borderRadius 12 padding 16 elevation 2):
  Row: flexDirection row, justifyContent space-between
  Left:
    Text "Order ID" fontSize 12, color #888
    Text orderId fontSize 15, fontWeight 700, color #333, marginTop 2
  Right:
    Text "Estimated Delivery" fontSize 12, color #888, textAlign right
    Text "Mon - Wed, Jun 16-18" fontSize 13, fontWeight 600, color #333, marginTop 2

  Divider marginVertical 12

  Status pill (alignSelf flex-start):
    backgroundColor #FEF3C7, paddingHorizontal 12, paddingVertical 6, borderRadius 20
    Text "🚚 In Transit" fontSize 13, fontWeight 600, color #92400E

CARD 2 — TRACKING STEPS (white card, same style):
  Label: "Tracking Details" fontSize 15, fontWeight 700, marginBottom 16

  For each step in TRACKING_STEPS:
    Row: flexDirection row, gap 12

    LEFT SIDE (width 24, alignItems center):
      Circle indicator:
        width 22, height 22, borderRadius 11
        If completed: backgroundColor #FF4747, Text "✓" white fontSize 11 center
        If current (first not completed): backgroundColor white,
          borderWidth 2, borderColor #FF4747, inner dot #FF4747
        If future: backgroundColor white, borderWidth 2, borderColor #DDD

      Vertical line (connecting to next step):
        width 2, flex 1, marginTop 4
        If completed: backgroundColor #FF4747
        If future: backgroundColor #EEE
        Do NOT show line after last step

    RIGHT SIDE (flex 1, paddingBottom 20):
      Text step title:
        fontSize 14, fontWeight 700
        If completed or current: color #333
        If future: color #AAA
      Text step description:
        fontSize 12, marginTop 2
        If completed or current: color #666
        If future: color #BBB
      Text step time:
        fontSize 11, marginTop 4
        If completed: color #FF4747
        If future: color #CCC

CARD 3 — DELIVERY PARTNER (white card, same style):
  Label: "Delivery Partner"
  Row: flexDirection row, alignItems center, gap 12
  
  Avatar circle: width 50, height 50, borderRadius 25, backgroundColor #F5F5F5
    Text "🧑" fontSize 28, textAlign center
  
  View flex 1:
    Text "Usman Rider" fontSize 15, fontWeight 700
    Text "⭐ 4.8 · 1,200+ deliveries" fontSize 12, color #888, marginTop 2
  
  Call button:
    backgroundColor #D1FAE5, borderRadius 20, padding 10
    Text "📞" fontSize 20
    onPress: Alert.alert('Calling...', 'Connecting to rider')

Add View height={40} at bottom.
```

---

## 📋 CHUNK ORDER SUMMARY

| Chunk | Screen | Kya banega |
|-------|--------|-----------|
| Chunk 1 | All | Navigation setup |
| Chunk 2 | Checkout | Dummy data + States |
| Chunk 3 | Checkout | Top Bar + Address Section |
| Chunk 4 | Checkout | Order Summary + Payment Method |
| Chunk 5 | Checkout | Place Order Button |
| Chunk 6 | Confirmation | Full Order Confirmation Screen |
| Chunk 7 | Tracking | Full Order Tracking Screen |

## ⚠️ IMPORTANT NOTES
- Chunk 1 ke baad test karo — Buy Now click karne par CheckoutScreen open ho
- Chunk 5 ke baad full checkout flow test karo
- Chunk 6 ke baad "Place Order" click karo — confirmation screen aani chahiye
- Chunk 7 ke baad "Track Order" click karo — tracking screen aani chahiye
- Har chunk complete hone ke baad hi agla do
EOF