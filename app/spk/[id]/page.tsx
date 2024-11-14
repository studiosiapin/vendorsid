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

    const canvas = await html2canvas(spkRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    while (position < pdfHeight) {
      pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, pdfHeight);
      position += pageHeight;
      if (position < pdfHeight) {
        pdf.addPage();
      }
    }

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
    <div className="flex h-screen justify-center overflow-auto bg-zinc-300 p-6">
      <Button
        onClick={() => exportToPDF(order.invoiceId)}
        className="absolute right-10 top-6 mb-3"
      >
        Download PDF
      </Button>
      <div
        id="spk"
        ref={spkRef}
        className="h-max w-full max-w-screen-md bg-white p-6"
      >
        <div className="mb-6 text-center">
          <div className="text-2xl font-semibold">PT Satu Baju Indonesia</div>
          <div className="text-xl font-semibold">SPK Produksi</div>
        </div>

        {/* Table Detail Order  */}
        <div className="grid grid-cols-2">
          <table className="w-full table-auto border text-sm">
            <tr className="">
              <td className=" p-1.5">Hari / Tgl</td>
              <td className=" p-1.5">{formatDate(order?.createdAt || '')}</td>
            </tr>
            <tr className="">
              <td className=" p-1.5">No. Invoice</td>
              <td className=" p-1.5">{order?.invoiceId}</td>
            </tr>
            <tr className="pb-5">
              <td className="p-1.5 pb-5">Customer</td>
              <td className="p-1.5 pb-5">{order?.user.name}</td>
            </tr>
          </table>
          <table className="w-full table-auto border border-l-0 text-sm">
            <tr className="">
              <td className=" p-1.5">Deadline</td>
              <td className=" p-1.5">{formatDate(order?.finishAt || '')}</td>
            </tr>
            <tr className="">
              <td className=" p-1.5">Job</td>
              <td className=" p-1.5">Full Order</td>
            </tr>
            <tr className="">
              <td className="p-1.5 pb-5">Bahan</td>
              <td className="p-1.5 pb-5">{order?.bahanCode}</td>
            </tr>
          </table>
        </div>

        {/* Detail Qty */}
        <div className="mt-3">
          <div className="mb-3 text-lg font-semibold">Detail Qty</div>
          <table className="w-full border border-gray-300 text-sm">
            <tr className=" border-gray-300">
              <th className="border border-gray-300 p-1.5 pb-5 text-left">
                Kode Bahan
              </th>
              <th className="border border-gray-300 p-1.5 pb-5 text-left">
                Ukuran
              </th>
              <th className="border border-gray-300 p-1.5 pb-5 text-left">
                Qty
              </th>
            </tr>
            {order?.orderDetails.map((detail, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 p-1.5 pb-5">
                  {order.bahanCode}
                </td>
                <td className="border border-gray-300 p-1.5 pb-5">
                  {detail.ukuran.name}
                </td>
                <td className="border border-gray-300 p-1.5 pb-5">
                  {detail.quantity}
                </td>
              </tr>
            ))}
          </table>
        </div>
        {/* Desain Order */}
        <div className="mt-3">
          <div className="grid grid-cols-2">
            <div className="">
              <div className="mb-2 text-lg font-semibold">Foto Layout</div>
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
              <div className="mb-2 text-lg font-semibold">Foto Kerah</div>
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
            <div className="mb-2 text-lg font-semibold">Foto Mockup</div>
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
    </div>
  );
};

export default SPKPage;
