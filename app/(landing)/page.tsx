import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const benefits = [
    {
        title: 'Harga Kompetitif',
        description:
            'Dengan Kapasitas produksi besar dan langsung dari tangan pertama, produk kami memiliki harga yang kompetitif & sangat mungkin untuk anda yang ingin menjadi reseller maupun dropshipper.'
    },
    {
        title: 'Hasil Berkualitas',
        description:
            'Menggunakan mesin teknologi terbaru dengan tenaga kerja profesional di bidangnya sehingga menghasilkan produk yang berkualitas dan bebas reject.'
    },
    {
        title: 'Kecepatan Produksi',
        description:
            'Tim produksi internal dikerjakan dalam 1 atap sehingga hanya membutuhkan waktu 3-10 hari pengerjaan untuk menyelesaikan pesanan Anda.'
    }
];

const services = [
    {
        title: 'Kebutuhan Olahraga, Komunitas, Dan Tim',
        description:
            'Jaga kekompakan dengan seragam komunitas yang bisa di customisasi menggambarkan kebanggaan team',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'
    },
    {
        title: 'Event Olahraga, Pemerintah, Instansi',
        description:
            'Jadikan acara Anda lebih berkesan dan profesional dengan produk fashion yang bisa di customisasi sesuai kebutuhan',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800'
    },
    {
        title: 'Rintis Brand Anda Sendiri',
        description:
            'Buat design dan ciptakan produkmu sendiri dengan bantuan jasa printing sublim hingga full order produk sublim',
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800'
    }
];

const capabilities = [
    'Layanan Design Profesional',
    'Kualitas Mesin Berteknologi',
    'Kecepatan Kapasitas Besar',
    'Tenaga Kerja Ahli & Terampil'
];

const orderSteps = [
    {
        title: 'Hubungi Admin',
        description:
            'Chat admin menggunakan whatsapp dan konsultasikan kebutuhanmu'
    },
    {
        title: 'SPK & Invoice',
        description:
            'Admin Akan merekap kebutuhan mu, dan memberikan tagihan sesuai pesanan'
    },
    {
        title: 'Proses Produksi',
        description:
            'Design, Proofing, Layouting, Printing, Press, Cutting, Jahit Hingga Finishing Packing'
    },
    {
        title: 'Pengiriman Barang',
        description:
            'Setelah barang siap dan pelunasan selesai, Barang akan dikirimkan'
    }
];

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <nav className="fixed z-50 flex w-full items-center justify-between bg-white/80 p-6 backdrop-blur-sm">
                <h1 className="text-xl font-bold">VendorsID</h1>
                <div className="space-x-4">
                    <Link href="/sign-in">
                        <Button>Sign In</Button>
                    </Link>
                </div>
            </nav>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-screen">
                    <div className="absolute inset-0">
                        <Image
                            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=2000"
                            alt="Hero background"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/50" />
                    </div>

                    <div className="relative flex h-full items-center px-6 pb-20 pt-32">
                        <div className="mx-auto max-w-4xl text-center text-white">
                            <h1 className="mb-6 text-5xl font-bold tracking-tight">
                                We Are VENDOR ID
                            </h1>
                            <p className="mb-8 text-xl">
                                Vendors.id, vendor printing tekstil terpercaya
                                dengan pengalaman luas dan komitmen tinggi untuk
                                menghadirkan produk berkualitas terbaik dengan
                                harga terjangkau. Didukung mesin canggih dan tim
                                profesional yang terpusat di satu lokasi
                                produksi.
                            </p>
                            <Button
                                size="lg"
                                className="bg-[#FFCA4A] text-black hover:bg-[#ffc933]"
                            >
                                Hubungi Admin
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="bg-gray-50 px-6 py-20">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-3xl font-bold">
                            Kenapa Harus VENDORS.ID?
                        </h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg bg-white p-6 shadow-sm"
                                >
                                    <h3 className="mb-4 text-xl font-semibold">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {benefit.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Capabilities Section */}
                <section className="bg-[#FFCA4A] px-6 py-20">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-3xl font-bold">
                            VENDORS.ID BUKAN TEMPAT PRODUKSI BIASA
                        </h2>
                        <div className="grid gap-8 md:grid-cols-4">
                            {capabilities.map((capability, index) => (
                                <div key={index} className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                                        <span className="text-2xl text-[#FFCA4A]">
                                            ✓
                                        </span>
                                    </div>
                                    <h3 className="font-bold">{capability}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Order Steps Section */}
                <section className="px-6 py-20">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-3xl font-bold">
                            Bagaimana Cara Pesannya?
                        </h2>
                        <div className="grid gap-8 md:grid-cols-4">
                            {orderSteps.map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFCA4A]">
                                        <span className="text-xl font-bold">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="mb-2 font-bold">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="bg-[#FFCA4A] px-6 py-20">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="mb-6 text-3xl font-bold">
                            Sudah Tentukan Pilihan?
                        </h2>
                        <p className="mb-8 text-lg">
                            Admin VENDORS.ID Siap Membantumu. Yuk Hubungi Admin
                            Melalui WhatsApp
                        </p>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="bg-white hover:bg-gray-100"
                        >
                            WhatsApp Admin
                        </Button>
                    </div>
                </section>

                {/* Footer Info */}
                <section className="bg-gray-900 px-6 py-12 text-white">
                    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
                        <div>
                            <h3 className="mb-4 text-xl font-bold">
                                Kantor & Workshop
                            </h3>
                            <p>Jl. Gumuruh No. 93, Batununggal</p>
                            <p className="mt-4">Jam Operasional:</p>
                            <p>Senin - Jumat Jam 09.00 - 16.00</p>
                            <p>Sabtu Jam 09.00 - 14.30</p>
                            <p>Hari Minggu & Tanggal Merah Libur</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
