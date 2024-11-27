'use client';
import { useGetOrderById } from '@/hooks/useOrder';
import { formatDate } from '@/lib/utils';
import { OrderResponse } from '@/types/response';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';

const SPKPage = () => {
    const session = useSession();
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { isLoading: isFetching, getOrderById } = useGetOrderById();
    const [order, setOrder] = useState<OrderResponse>();
    const spkRef = useRef<HTMLDivElement>(null);
    const [isPrinted, setIsPrinted] = useState(false);

    const exportToPDF = async (invoiceId: string) => {
        if (!spkRef.current) return;

        const canvas = await html2canvas(spkRef.current, { scale: 1.5 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`SPK-${invoiceId}.pdf`);
    };

    useEffect(() => {
        if (!session.data || session.data.user.role == 'reseller') {
            return router.push('/');
        }
        getOrderById(id).then((data) => {
            setOrder(data.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (order && !isPrinted) {
            exportToPDF(order.invoiceId);
            setIsPrinted(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);

    if (isFetching || !order) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-screen overflow-auto bg-zinc-300 p-6 !text-black md:flex md:justify-center">
            <Button
                onClick={() => exportToPDF(order.invoiceId)}
                className="absolute right-10 top-6 mb-3"
            >
                Download PDF
            </Button>
            <div
                id="spk"
                ref={spkRef}
                className="h-[1240px] max-h-[1240px] min-h-[1240px] w-[874px] min-w-[874px] max-w-[874px] bg-white p-6"
            >
                <div className="mb-6 ">
                    <div className="text-2xl font-semibold italic">
                        PT Satu Baju Indonesia
                    </div>
                    <div className="text-center text-xl font-semibold underline">
                        SPK Produksi
                    </div>
                </div>

                {/* Table Detail Order  */}
                <div className="mb-3 grid grid-cols-2 border text-sm">
                    <div className="flex flex-col">
                        <div className="grid grid-cols-[0.5fr_10px_1fr] border-b p-1.5">
                            <span>Hari / Tgl</span>
                            <span>:</span>
                            <span>{formatDate(order?.createdAt || '')}</span>
                        </div>
                        <div className="grid grid-cols-[0.5fr_10px_1fr] border-b p-1.5">
                            <span>No. Invoice</span>
                            <span>:</span>
                            <span>{order?.invoiceId}</span>
                        </div>
                        <div className="grid grid-cols-[0.5fr_10px_1fr] p-1.5">
                            <span>Customer</span>
                            <span>:</span>
                            <span>{order?.user.name}</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="grid grid-cols-[0.5fr_10px_1fr] border-b p-1.5">
                            <span>Deadline</span>
                            <span>:</span>
                            <span className="font-semibold">
                                {formatDate(order?.finishAt || '')}
                            </span>
                        </div>
                        <div className="grid grid-cols-[0.5fr_10px_1fr] border-b p-1.5">
                            <span>Job</span>
                            <span>:</span>
                            <span>FULLORDER</span>
                        </div>
                        <div className="grid grid-cols-[0.5fr_10px_1fr] p-1.5">
                            <span>Bahan</span>
                            <span>:</span>
                            <span>{order?.bahanCode}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-[3fr_2fr] gap-2">
                    <div className="border border-black">
                        <div className="border-b border-black py-1 text-center text-xs font-semibold">
                            DESAIN
                        </div>
                        <div className="p-3">
                            {/* Desain Order */}
                            <div className="grid grid-cols-2">
                                <div className="">
                                    <div className="mb-2 text-xs">
                                        Foto Layout
                                    </div>
                                    <Image
                                        src={order?.linkLayout || ''}
                                        alt="Foto Layout"
                                        width={300}
                                        height={300}
                                        className="h-48 w-auto"
                                    />
                                </div>
                                {/* kerah */}
                                <div className="">
                                    <div className="mb-2 text-xs">
                                        Foto Kerah
                                    </div>
                                    <Image
                                        src={order?.linkCollar || ''}
                                        alt="Foto Kerah"
                                        width={300}
                                        height={300}
                                        className="h-48 w-auto"
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="mb-2 text-xs">Foto Mockup</div>
                                <Image
                                    src={order?.linkMockup || ''}
                                    alt="Foto Mockup"
                                    width={300}
                                    height={300}
                                    className="h-48 w-auto"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="border border-black">
                            <div className="grid grid-cols-[2fr_0.5fr_1fr] border-b border-black text-xs font-semibold">
                                <div className="p-1 ">Keterangan</div>
                                <div className="border-l border-black p-1">
                                    Qty
                                </div>
                                <div className="border-l border-black p-1">
                                    Cones
                                </div>
                            </div>

                            {/* Loop row kosong dari array */}
                            {Array.from({ length: 20 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`grid grid-cols-[2fr_0.5fr_1fr] text-xs ${
                                        index === 19
                                            ? ''
                                            : 'border-b border-black'
                                    }`}
                                >
                                    <div className="p-[10px]"></div>
                                    <div className="border-l border-black p-[10px]"></div>
                                    <div className="border-l border-black p-[10px]"></div>
                                </div>
                            ))}
                        </div>
                        <div className="border border-black">
                            <div className="border-b border-black py-1 text-center text-xs font-semibold">
                                PRINT
                            </div>
                            <div className="grid grid-cols-[1fr_1.5fr] border-b border-black">
                                <div className="p-1 text-xs font-semibold">
                                    File Masuk :
                                </div>
                                <div className="border-l border-black p-1"></div>
                            </div>
                            <div className="grid grid-cols-[1fr_1.5fr] border-b border-black">
                                <div className="p-1 text-xs font-semibold">
                                    Start :
                                </div>
                                <div className="border-l border-black p-1"></div>
                            </div>
                            <div className="grid grid-cols-[1fr_1.5fr] border-b border-black">
                                <div className="p-1 text-xs font-semibold">
                                    Finish :
                                </div>
                                <div className="border-l border-black p-1"></div>
                            </div>
                            <div className="grid grid-cols-[1fr_1.5fr] border-b border-black">
                                <div className="p-1 text-xs font-semibold">
                                    Profile :
                                </div>
                                <div className="border-l border-black p-1"></div>
                            </div>
                            <div className="grid grid-cols-[1fr_1.5fr]">
                                <div className="p-1 text-xs font-semibold">
                                    Mesin :
                                </div>
                                <div className="border-l border-black p-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-[3fr_1fr] items-start gap-2">
                    {/* Detail Qty */}
                    <div className="grid grid-cols-3 border border-black text-xs">
                        <div className="border-b border-black p-1.5">
                            Kode Bahan
                        </div>
                        <div className="border-b border-black p-1.5">
                            Ukuran
                        </div>
                        <div className="border-b border-black p-1.5">Qty</div>
                        {order?.orderDetails.map((detail, index) => (
                            <>
                                <div
                                    className={`p-1.5 ${
                                        index !== order.orderDetails.length - 1
                                            ? 'border-b border-black'
                                            : ''
                                    }`}
                                >
                                    {order.bahanCode}
                                </div>
                                <div
                                    className={`p-1.5 ${
                                        index !== order.orderDetails.length - 1
                                            ? 'border-b border-black'
                                            : ''
                                    }`}
                                >
                                    {detail.ukuran.name}
                                </div>
                                <div
                                    className={`p-1.5 ${
                                        index !== order.orderDetails.length - 1
                                            ? 'border-b border-black'
                                            : ''
                                    }`}
                                >
                                    {detail.quantity}
                                </div>
                            </>
                        ))}
                    </div>
                    <div className="border border-black text-xs">
                        <div className="border-b border-black p-1 text-center font-semibold">
                            Catatan Tambahan
                        </div>
                        <div className="border-b border-black p-2.5"></div>
                        <div className="border-b border-black p-2.5"></div>
                        <div className="border-b border-black p-2.5"></div>
                        <div className="p-2.5"></div>
                    </div>
                </div>

                <div className="mt-3 grid h-[200px] grid-cols-[1fr_1fr_1.5fr_1fr] border border-black">
                    {/* Press */}
                    <div className="flex flex-col text-xs">
                        <div className="border-b border-black p-1 font-semibold">
                            Press
                        </div>
                        <div className="border-b border-black p-1 ">Start:</div>
                        <div className="border-b border-black p-1 ">
                            Finish:
                        </div>
                        <div className="border-b border-black p-1 ">Speed:</div>
                        <div className="border-b border-black p-1 ">Suhu:</div>
                    </div>
                    {/* QC + Gunting */}
                    <div className="flex flex-col border-l border-black text-xs">
                        <div className="border-b border-black p-1 font-semibold">
                            QC + Gunting
                        </div>
                        <div className="border-b border-black p-1 ">Start:</div>
                        <div className="border-b border-black p-1 ">
                            Finish:
                        </div>
                        <div className="border-b border-black p-1 ">
                            Jumlah:
                        </div>
                        <div className="border-b border-black p-1 ">
                            Reject:
                        </div>
                    </div>
                    {/* Jahit */}
                    <div className="flex flex-col border-l border-black text-xs">
                        <div className="border-b border-black p-1 font-semibold">
                            Jahit
                        </div>
                        <div className="border-b border-black p-1 ">Start:</div>
                        <div className="border-b border-black p-1 ">
                            Finish:
                        </div>
                        <div className="border-b border-black p-1 ">
                            Jumlah:
                        </div>
                    </div>
                    {/* Packing */}
                    <div className="flex flex-col border-l border-black text-xs">
                        <div className="border-b border-black p-1 font-semibold">
                            Jahit
                        </div>
                        <div className="border-b border-black p-1 ">Start:</div>
                        <div className="border-b border-black p-1 ">
                            Finish:
                        </div>
                        <div className="border-b border-black p-1 ">
                            Jumlah:
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SPKPage;
