// "use client"

// import { useEffect, useState } from "react"
// import { useParams, Link } from "react-router-dom"
// import {
//     ArrowLeft,
//     Package,
//     ShoppingCart,
//     Loader2,
//     AlertCircle,
//     ChevronFirst,
//     ChevronLast,
//     ChevronLeft,
//     ChevronRight,
//     BadgeDollarSign,
//     Box,
//     ListOrdered,
// } from "lucide-react"

// // import OrderDetailService from "../service/OrderDetailService"
// // import ProductService from "../service/ProductService"

// const OrderDetail = () => {
//     const { orderId } = useParams()
//     const [order, setOrder] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [currentPage, setCurrentPage] = useState(1)
//     const itemsPerPage = 5
//     const [orderTotal, setOrderTotal] = useState(0)

//     useEffect(() => {
//         const fetchOrderDetail = async () => {
//             try {
//                 const data = await OrderDetailService.getOrderDetails(orderId)

//                 if (data && data.length > 0) {
//                     const enrichedDetails = await Promise.all(
//                         data.map(async (detail) => {
//                             try {
//                                 const product = await ProductService.getById(detail.productId)
//                                 return { ...detail, product }
//                             } catch (error) {
//                                 console.error(`Lỗi khi lấy sản phẩm ${detail.productId}:`, error)
//                                 return { ...detail, product: null }
//                             }
//                         }),
//                     )

//                     const total = enrichedDetails.reduce((sum, item) => {
//                         const price = item.product?.price || 0
//                         const quantity = item.quantity || 0
//                         return sum + price * quantity
//                     }, 0)

//                     setOrder({
//                         orderId,
//                         order_details: enrichedDetails,
//                     })

//                     setOrderTotal(total)
//                 } else {
//                     setError("Không có chi tiết đơn hàng hoặc sản phẩm.")
//                 }
//             } catch (error) {
//                 console.error("Lỗi khi tải chi tiết đơn hàng:", error)
//                 setError("Có lỗi xảy ra khi tải thông tin đơn hàng.")
//             } finally {
//                 setLoading(false)
//             }
//         }

//         if (orderId) {
//             fetchOrderDetail()
//         } else {
//             setError("Không tìm thấy mã đơn hàng trong URL")
//             setLoading(false)
//         }
//     }, [orderId])

//     if (loading) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-700">
//                 <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
//                 <p className="mt-4 text-lg font-medium">Đang tải dữ liệu đơn hàng...</p>
//             </div>
//         )
//     }

//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
//                 <AlertCircle className="w-12 h-12 text-red-500" />
//                 <p className="mt-4 text-lg font-semibold text-red-500">{error}</p>
//                 <Link
//                     to="/order"
//                     className="flex items-center px-4 py-2 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700"
//                 >
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Quay lại danh sách đơn hàng
//                 </Link>
//             </div>
//         )
//     }

//     const indexOfLastItem = currentPage * itemsPerPage
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage
//     const currentItems = order.order_details.slice(indexOfFirstItem, indexOfLastItem)
//     const totalPages = Math.ceil(order.order_details.length / itemsPerPage)

//     const handlePageChange = (page) => setCurrentPage(page)

//     return (
//         <div className="container px-4 py-8 mx-auto max-w-7xl">
//             <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
//                     <ListOrdered className="w-7 h-7 text-blue-600" />
//                     Chi tiết đơn hàng
//                 </h1>
//                 <div className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-md">
//                     Mã đơn: #{order.orderId}
//                 </div>
//             </div>

//             <div className="overflow-hidden bg-white border rounded-xl shadow-md">
//                 <div className="p-4 border-b bg-gray-100">
//                     <div className="flex items-center">
//                         <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
//                         <h2 className="text-lg font-semibold text-gray-800">Danh sách sản phẩm</h2>
//                         <span className="ml-auto text-sm text-gray-500">{order.order_details.length} sản phẩm</span>
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Sản phẩm</th>
//                                 <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Đơn giá</th>
//                                 <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Số lượng</th>
//                                 <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Thành tiền</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {currentItems.map((detail, index) => {
//                                 const product = detail.product
//                                 const price = product?.price || 0
//                                 const quantity = detail.quantity || 0
//                                 const total = price * quantity

//                                 return (
//                                     <tr key={index} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4">
//                                             <div className="flex items-center gap-4">
//                                                 <div className="w-16 h-16 flex-shrink-0">
//                                                     {product?.imageUrl ? (
//                                                         <img
//                                                             src={`https://localhost:7024/images/${product.imageUrl}`}
//                                                             alt={product.name}
//                                                             className="object-cover w-16 h-16 rounded-md border"
//                                                         />
//                                                     ) : (
//                                                         <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-md">
//                                                             <Package className="w-8 h-8 text-gray-400" />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 <div>
//                                                     <div className="font-medium text-gray-900">{product?.name || "Không có tên sản phẩm"}</div>
//                                                     <div className="text-sm text-gray-500">ID: {detail.productId}</div>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 text-sm text-center text-gray-800">{price.toLocaleString("vi-VN")}₫</td>
//                                         <td className="px-6 py-4 text-sm text-center text-gray-800">
//                                             <span className="inline-block px-3 py-1 bg-gray-100 rounded-full font-medium">{quantity}</span>
//                                         </td>
//                                         <td className="px-6 py-4 text-sm text-right font-semibold text-blue-600">
//                                             {total.toLocaleString("vi-VN")}₫
//                                         </td>
//                                     </tr>
//                                 )
//                             })}
//                         </tbody>
//                         <tfoot className="bg-gray-50">
//                             <tr>
//                                 <td colSpan={3} className="px-6 py-4 text-right font-medium text-gray-900">
//                                     <div className="inline-flex items-center gap-2">
//                                         <BadgeDollarSign className="w-5 h-5 text-green-600" />
//                                         Tổng cộng:
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 text-right text-lg font-bold text-green-600">
//                                     {orderTotal.toLocaleString("vi-VN")}₫
//                                 </td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                 </div>

//                 {totalPages > 1 && (
//                     <div className="flex items-center justify-center px-6 py-4 bg-gray-100 border-t">
//                         <nav className="flex items-center space-x-1">
//                             <button
//                                 onClick={() => handlePageChange(1)}
//                                 disabled={currentPage === 1}
//                                 className="p-2 text-gray-500 bg-white rounded hover:bg-gray-100 disabled:opacity-50"
//                             >
//                                 <ChevronFirst className="w-4 h-4" />
//                             </button>
//                             <button
//                                 onClick={() => handlePageChange(currentPage - 1)}
//                                 disabled={currentPage === 1}
//                                 className="p-2 text-gray-500 bg-white rounded hover:bg-gray-100 disabled:opacity-50"
//                             >
//                                 <ChevronLeft className="w-4 h-4" />
//                             </button>

//                             {Array.from({ length: totalPages }, (_, i) => {
//                                 if (
//                                     i === 0 ||
//                                     i === totalPages - 1 ||
//                                     (i >= currentPage - 2 && i <= currentPage + 1)
//                                 ) {
//                                     return (
//                                         <button
//                                             key={i}
//                                             onClick={() => handlePageChange(i + 1)}
//                                             className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === i + 1
//                                                 ? "bg-blue-600 text-white"
//                                                 : "bg-white text-gray-700 hover:bg-gray-100"
//                                                 }`}
//                                         >
//                                             {i + 1}
//                                         </button>
//                                     )
//                                 } else if ((i === 1 && currentPage > 3) || (i === totalPages - 2 && currentPage < totalPages - 2)) {
//                                     return (
//                                         <span key={i} className="px-2 py-1 text-gray-500">
//                                             ...
//                                         </span>
//                                     )
//                                 }
//                                 return null
//                             })}

//                             <button
//                                 onClick={() => handlePageChange(currentPage + 1)}
//                                 disabled={currentPage === totalPages}
//                                 className="p-2 text-gray-500 bg-white rounded hover:bg-gray-100 disabled:opacity-50"
//                             >
//                                 <ChevronRight className="w-4 h-4" />
//                             </button>
//                             <button
//                                 onClick={() => handlePageChange(totalPages)}
//                                 disabled={currentPage === totalPages}
//                                 className="p-2 text-gray-500 bg-white rounded hover:bg-gray-100 disabled:opacity-50"
//                             >
//                                 <ChevronLast className="w-4 h-4" />
//                             </button>
//                         </nav>
//                     </div>
//                 )}
//             </div>

//             <div className="mt-8 text-center">
//                 <Link
//                     to="/order"
//                     className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-md"
//                 >
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Quay lại danh sách đơn hàng
//                 </Link>
//             </div>
//         </div>
//     )
// }

// export default OrderDetail
