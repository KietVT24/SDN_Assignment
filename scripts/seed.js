import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dbConnect from '../lib/dbConnect.js';

const fashionProducts = [
  {
    name: "Áo Thun Basic Trắng",
    description: "Áo thun cotton 100% mềm mại, thiết kế tối giản phù hợp mọi phong cách. Chất liệu thoáng mát, dễ phối đồ.",
    price: 25000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
    category: "T-Shirt",
    gender: "Unisex",
    season: "Summer"
  },
  {
    name: "Hoodie Oversized Xám",
    description: "Hoodie oversized với chất liệu cotton blend cao cấp. Thiết kế rộng rãi, thoải mái, phong cách streetwear hiện đại.",
    price: 180000,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop",
    category: "Hoodie",
    gender: "Unisex",
    season: "Winter"
  },
  {
    name: "Áo Khoác Denim Vintage",
    description: "Áo khoác denim vintage với wash màu xanh cổ điển. Chất liệu denim bền bỉ, thiết kế timeless không bao giờ lỗi mốt.",
    price: 320000,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=400&fit=crop",
    category: "Jacket",
    gender: "Unisex",
    season: "Spring"
  },
  {
    name: "Quần Jeans Slim Fit Đen",
    description: "Quần jeans slim fit màu đen với chất liệu stretch co giãn. Thiết kế ôm vừa vặn, tôn dáng và dễ phối đồ.",
    price: 280000,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop",
    category: "Jeans",
    gender: "Men",
    season: "Autumn"
  },
  {
    name: "Váy Midi Minimalist Đen",
    description: "Váy midi thiết kế tối giản với chất liệu vải cao cấp. Dáng váy thanh lịch, phù hợp nhiều dịp từ công sở đến dạo phố.",
    price: 450000,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=400&fit=crop",
    category: "Dress",
    gender: "Women",
    season: "Spring"
  },
  {
    name: "Chân Váy A-Line Họa Tiết",
    description: "Chân váy A-line với họa tiết hoa nhẹ nhàng. Chất liệu vải mềm mại, dáng váy nữ tính và trẻ trung.",
    price: 220000,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=400&fit=crop",
    category: "Skirt",
    gender: "Women",
    season: "Summer"
  },
  {
    name: "Giày Sneaker Trắng",
    description: "Giày sneaker màu trắng với thiết kế clean và hiện đại. Đế giày êm ái, phù hợp mọi hoạt động hàng ngày.",
    price: 650000,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop",
    category: "Shoes",
    gender: "Unisex",
    season: "Summer"
  },
  {
    name: "Túi Xách Crossbody Da",
    description: "Túi xách crossbody làm từ da thật cao cấp. Thiết kế compact nhưng đủ rộng, phù hợp phong cách minimal.",
    price: 380000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
    category: "Accessory",
    gender: "Women",
    season: "Autumn"
  },
  {
    name: "Áo Thun Graphic Print",
    description: "Áo thun với họa tiết graphic độc đáo. Chất liệu cotton mềm mại, thiết kế trẻ trung và cá tính.",
    price: 35000,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=400&fit=crop",
    category: "T-Shirt",
    gender: "Unisex",
    season: "Summer"
  },
  {
    name: "Hoodie Zip-up Xanh Navy",
    description: "Hoodie zip-up màu xanh navy với chất liệu fleece ấm áp. Thiết kế có khóa kéo tiện lợi, phong cách casual.",
    price: 195000,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    category: "Hoodie",
    gender: "Men",
    season: "Winter"
  },
  {
    name: "Áo Khoác Bomber Đen",
    description: "Áo khoác bomber màu đen với chất liệu nylon nhẹ. Thiết kế quân đội cổ điển, phong cách streetwear hiện đại.",
    price: 420000,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop",
    category: "Jacket",
    gender: "Men",
    season: "Autumn"
  },
  {
    name: "Quần Jeans Mom Fit",
    description: "Quần jeans mom fit với thiết kế vintage. Chất liệu denim mềm mại, dáng quần thoải mái và nữ tính.",
    price: 260000,
    image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=400&fit=crop",
    category: "Jeans",
    gender: "Women",
    season: "Spring"
  },
  {
    name: "Váy Maxi Hoa Nhí",
    description: "Váy maxi với họa tiết hoa nhí nhẹ nhàng. Chất liệu chiffon mềm mại, dáng váy thướt tha và lãng mạn.",
    price: 520000,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=400&fit=crop",
    category: "Dress",
    gender: "Women",
    season: "Summer"
  },
  {
    name: "Chân Váy Pencil Đen",
    description: "Chân váy pencil màu đen với thiết kế ôm vừa vặn. Chất liệu vải cao cấp, phù hợp phong cách công sở.",
    price: 180000,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=400&fit=crop",
    category: "Skirt",
    gender: "Women",
    season: "Autumn"
  },
  {
    name: "Giày Boots Chelsea",
    description: "Giày boots chelsea với thiết kế cổ điển. Chất liệu da thật cao cấp, phong cách thanh lịch và sang trọng.",
    price: 850000,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop",
    category: "Shoes",
    gender: "Men",
    season: "Winter"
  },
  {
    name: "Vòng Cổ Minimalist",
    description: "Vòng cổ thiết kế tối giản với chất liệu bạc cao cấp. Thiết kế thanh lịch, phù hợp mọi phong cách thời trang.",
    price: 150000,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
    category: "Accessory",
    gender: "Women",
    season: "Spring"
  },
  {
    name: "Áo Thun Polo Trắng",
    description: "Áo polo màu trắng với chất liệu pique cotton. Thiết kế cổ điển, phù hợp phong cách preppy và casual.",
    price: 45000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
    category: "T-Shirt",
    gender: "Men",
    season: "Summer"
  },
  {
    name: "Hoodie Crop Top Hồng",
    description: "Hoodie crop top màu hồng với thiết kế trẻ trung. Chất liệu cotton mềm mại, phong cách Y2K hiện đại.",
    price: 165000,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop",
    category: "Hoodie",
    gender: "Women",
    season: "Spring"
  },
  {
    name: "Áo Khoác Trench Coat",
    description: "Áo khoác trench coat với thiết kế cổ điển. Chất liệu cotton blend cao cấp, phong cách thanh lịch và sang trọng.",
    price: 680000,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=400&fit=crop",
    category: "Jacket",
    gender: "Women",
    season: "Autumn"
  },
  {
    name: "Quần Shorts Cargo",
    description: "Quần shorts cargo với thiết kế nhiều túi tiện lợi. Chất liệu cotton blend bền bỉ, phong cách outdoor và casual.",
    price: 120000,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop",
    category: "Jeans",
    gender: "Unisex",
    season: "Summer"
  }
];

async function run() {
  try {
    await dbConnect();
    await Product.deleteMany({});
    await Product.insertMany(fashionProducts);
    console.log('✅ Seeded fashion products:', fashionProducts.length);
    console.log('🎉 Database populated with modern fashion items!');
  } catch (e) {
    console.error('❌ Error seeding database:', e);
  } finally {
    await mongoose.connection.close();
  }
}

run();
