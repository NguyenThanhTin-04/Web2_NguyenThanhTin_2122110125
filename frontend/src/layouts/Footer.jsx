import React from 'react'

function Footer() {
    return (
        <>
            <footer className="bg-gray-800 text-white mt-12">
                <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Cột 1: Logo và mô tả */}
                    <div>
                        <h2 className="text-2xl font-bold text-blue-400">MyLogo</h2>
                        <p className="mt-2 text-sm text-gray-300">
                            Chúng tôi mang đến giải pháp hiện đại và tiện lợi cho người dùng Việt Nam.
                        </p>
                    </div>

                    {/* Cột 2: Menu chính */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Menu</h3>
                        <ul className="space-y-1 text-sm">
                            <li><a href="/" className="hover:text-blue-400">Trang chủ</a></li>
                            <li><a href="/about" className="hover:text-blue-400">Giới thiệu</a></li>
                            <li><a href="/services" className="hover:text-blue-400">Dịch vụ</a></li>
                            <li><a href="/contact" className="hover:text-blue-400">Liên hệ</a></li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Hỗ trợ</h3>
                        <ul className="space-y-1 text-sm">
                            <li><a href="#" className="hover:text-blue-400">Câu hỏi thường gặp</a></li>
                            <li><a href="#" className="hover:text-blue-400">Điều khoản sử dụng</a></li>
                            <li><a href="#" className="hover:text-blue-400">Chính sách bảo mật</a></li>
                        </ul>
                    </div>

                    {/* Cột 4: Liên hệ */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Liên hệ</h3>
                        <p className="text-sm">📍 20 Tăng Nhơn Phú, Q9, HCM</p>
                        <p className="text-sm">📞 012345678889</p>
                        <p className="text-sm">📧 Caodangcongthuong.com</p>
                    </div>
                </div>

                {/* Dòng cuối */}
                <div className="bg-gray-900 text-center py-4 text-sm text-gray-400">
                    © {new Date().getFullYear()} MyLogo. All rights reserved.
                </div>
            </footer>
        </>
    )
}

export default Footer