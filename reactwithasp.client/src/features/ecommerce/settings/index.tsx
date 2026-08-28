import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Store, CreditCard, Truck, Save, CheckCircle2 } from 'lucide-react'

export function EcommerceSettings() {
  const [storeInfo, setStoreInfo] = useState({
    name: 'Toko Serba Ada Official Store',
    email: 'contact@tokoserbaada.id',
    phone: '0812-9988-7766',
    address: 'Jl. Sudirman Tower A Lt. 12, Jakarta Pusat, 10220',
    description: 'Pusat belanja kebutuhan fashion, gadget, dan kecantikan terpercaya.',
  })

  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan Toko</h1>
          <p className="text-sm text-muted-foreground">
            Konfigurasi identitas toko, saluran pembayaran, dan opsi pengiriman e-commerce Anda.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Pengaturan berhasil disimpan!
        </div>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Store className="h-4 w-4" /> Profil Toko
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Pembayaran
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="h-4 w-4" /> Pengiriman
          </TabsTrigger>
        </TabsList>

        {/* General Store Tab */}
        <TabsContent value="general">
          <Card>
            <form onSubmit={handleSave}>
              <CardHeader>
                <CardTitle>Profil & Informasi Toko</CardTitle>
                <CardDescription>
                  Informasi ini akan muncul pada struk, email konfirmasi, dan halaman checkout pembeli.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="sName">Nama Toko Online</Label>
                  <Input
                    id="sName"
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sEmail">Email Resmi Toko</Label>
                    <Input
                      id="sEmail"
                      type="email"
                      value={storeInfo.email}
                      onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sPhone">Nomor Telepon / WhatsApp CS</Label>
                    <Input
                      id="sPhone"
                      value={storeInfo.phone}
                      onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sAddress">Alamat Pengirim / Gudang Utama</Label>
                  <Textarea
                    id="sAddress"
                    rows={3}
                    value={storeInfo.address}
                    onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sDesc">Slogan / Deskripsi Singkat Toko</Label>
                  <Textarea
                    id="sDesc"
                    rows={2}
                    value={storeInfo.description}
                    onChange={(e) => setStoreInfo({ ...storeInfo, description: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Payment Gateways Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Metode Pembayaran (Payment Gateway)</CardTitle>
              <CardDescription>
                Aktifkan opsi pembayaran yang didukung untuk pembeli Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-semibold text-sm">QRIS Instant (GoPay, OVO, ShopeePay, DANA)</div>
                  <div className="text-xs text-muted-foreground">Pembayaran otomatis menggunakan pemindaian QRIS.</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-semibold text-sm">Transfer Bank Virtual Account (BCA, Mandiri, BRI, BNI)</div>
                  <div className="text-xs text-muted-foreground">Konfirmasi otomatis tanpa perlu upload bukti transfer.</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-semibold text-sm">Kartu Kredit / Debit (Visa, Mastercard)</div>
                  <div className="text-xs text-muted-foreground">Pembayaran internasional dan lokal kartu kredit.</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">Bayar di Tempat (COD - Cash on Delivery)</div>
                  <div className="text-xs text-muted-foreground">Pembayaran tunai saat kurir menyerahkan barang.</div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Logistics Tab */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Opsi Pengiriman & Kurir</CardTitle>
              <CardDescription>
                Pilih ekspedisi dan perhitungan ongkos kirim otomatis yang aktif di checkout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-semibold text-sm">JNE Express (REG / YES)</div>
                  <div className="text-xs text-muted-foreground">Dukungan pengiriman reguler dan kilat 1 hari.</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-semibold text-sm">J&T Express</div>
                  <div className="text-xs text-muted-foreground">Pengiriman cepat ke seluruh wilayah Indonesia.</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-semibold text-sm">SiCepat Ekspres (GOKIL / REG)</div>
                  <div className="text-xs text-muted-foreground">Pengiriman cargo dan reguler terintegrasi.</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">Instant Courier (GoSend / GrabExpress)</div>
                  <div className="text-xs text-muted-foreground">Pengiriman sameday / instant dalam kota.</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
