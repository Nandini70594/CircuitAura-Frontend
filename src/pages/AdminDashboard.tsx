import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Package, BookOpen, FileText, Plus, Edit, Trash2 } from "lucide-react";
import { API } from "@/config/api"; // ✅ important

const AdminDashboard = () => {
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  // Products
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productFeatures, setProductFeatures] = useState("");
  const [productIncluded, setProductIncluded] = useState("");
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImageUrl, setProductImageUrl] = useState("");
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API.BASE}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setRecentProducts(data);
      } catch {
        toast({
          title: "Error",
          description: "Could not load products.",
          variant: "destructive",
        });
      }
    };
    fetchProducts();
  }, [toast]);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProductImageFile(e.target.files[0]);
      setProductImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API.BASE}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) throw new Error("File upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (productImageFile) {
        imageUrl = await uploadFile(productImageFile);
      }
      const response = await fetch(`${API.BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: productName,
          description: productDescription,
          price: productPrice,
          features: productFeatures,
          included: productIncluded,
          image_url: imageUrl,
        }),
      });
      if (!response.ok) throw new Error("Failed to add product");
      toast({
        title: "Product added!",
        description: "New product has been added successfully.",
      });
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductFeatures("");
      setProductIncluded("");
      setProductImageFile(null);
      setProductImageUrl("");
      const newProduct = await response.json();
      setRecentProducts((prev) => [newProduct, ...prev]);
    } catch {
      toast({
        title: "Error",
        description: "Failed to add product.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (product: any) => {
    setEditProductId(product.id);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price);
    setProductFeatures(product.features || "");
    setProductIncluded(product.included || "");
    setProductImageUrl(product.image_url || "");
    setProductImageFile(null);
  };

  const cancelEdit = () => {
    setEditProductId(null);
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductFeatures("");
    setProductIncluded("");
    setProductImageFile(null);
    setProductImageUrl("");
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProductId) return;
    try {
      let imageUrl = productImageUrl;
      if (productImageFile) {
        imageUrl = await uploadFile(productImageFile);
      }
      const response = await fetch(`${API.BASE}/products/${editProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: productName,
          description: productDescription,
          price: productPrice,
          features: productFeatures,
          included: productIncluded,
          image_url: imageUrl,
        }),
      });
      if (!response.ok) throw new Error("Failed to update product");
      toast({ title: "Product updated", variant: "success" });
      const updatedProduct = await response.json();
      setRecentProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      cancelEdit();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const response = await fetch(`${API.BASE}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete product");
      toast({ title: "Product deleted", variant: "success" });
      setRecentProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  // Kits
  const [kitName, setKitName] = useState("");
  const [kitDescription, setKitDescription] = useState("");
  const [kitPrice, setKitPrice] = useState("");
  const [kitImageFile, setKitImageFile] = useState<File | null>(null);
  const [kitImageUrl, setKitImageUrl] = useState("");
  const [kitBookletFile, setKitBookletFile] = useState<File | null>(null);
  const [kitBookletName, setKitBookletName] = useState("");
  const [kitBookletUrl, setKitBookletUrl] = useState("");
  const [recentKits, setRecentKits] = useState<any[]>([]);
  const [editKitId, setEditKitId] = useState<number | null>(null);
  const [kitIncluded, setKitIncluded] = useState("");

  const onKitImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setKitImageFile(e.target.files[0]);
      setKitImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onKitBookletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setKitBookletFile(e.target.files[0]);
      setKitBookletName(e.target.files[0].name);
    }
  };

  const handleEditKitClick = (kit: any) => {
    setEditKitId(kit.id);
    setKitName(kit.name);
    setKitDescription(kit.description);
    setKitPrice(kit.price);
    setKitImageUrl(kit.image_url || "");
    setKitImageFile(null);
    setKitBookletUrl(kit.pdf_url || "");
    setKitBookletName(kit.pdf_url ? kit.pdf_url.split("/").pop() : "");
    setKitBookletFile(null);
    setKitIncluded(kit.included || "");
  };

  const cancelEditKit = () => {
    setEditKitId(null);
    setKitName("");
    setKitDescription("");
    setKitPrice("");
    setKitImageFile(null);
    setKitImageUrl("");
    setKitBookletFile(null);
    setKitBookletName("");
    setKitBookletUrl("");
    setKitIncluded("");
  };

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const res = await fetch(`${API.BASE}/kits`);
        if (!res.ok) throw new Error("Failed to fetch kits");
        const data = await res.json();
        setRecentKits(data);
      } catch {
        toast({
          title: "Error",
          description: "Could not load kits.",
          variant: "destructive",
        });
      }
    };
    fetchKits();
  }, [toast]);

  const handleAddKit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      let bookletUrl = "";
      if (kitImageFile) imageUrl = await uploadFile(kitImageFile);
      if (kitBookletFile) bookletUrl = await uploadFile(kitBookletFile);

      const response = await fetch(`${API.BASE}/kits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: kitName,
          description: kitDescription,
          price: kitPrice,
          image_url: imageUrl,
          pdf_url: bookletUrl,
          included: kitIncluded,
        }),
      });
      if (!response.ok) throw new Error("Failed to add kit");
      const newKit = await response.json();

      toast({
        title: "Educational kit added!",
        description: "New educational kit has been added successfully.",
      });

      setKitName("");
      setKitDescription("");
      setKitPrice("");
      setKitImageFile(null);
      setKitImageUrl("");
      setKitBookletFile(null);
      setKitBookletName("");
      setKitBookletUrl("");
      setRecentKits((prev) => [newKit, ...prev]);
    } catch {
      toast({
        title: "Error",
        description: "Failed to add kit.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateKit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editKitId) return;
    try {
      let imageUrl = kitImageUrl;
      let bookletUrl = "";

      if (kitImageFile) imageUrl = await uploadFile(kitImageFile);
      if (kitBookletFile) bookletUrl = await uploadFile(kitBookletFile);

      const response = await fetch(`${API.BASE}/kits/${editKitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: kitName,
          description: kitDescription,
          price: kitPrice,
          image_url: imageUrl,
          pdf_url: bookletUrl || kitBookletName || "",
          included: kitIncluded,
        }),
      });
      if (!response.ok) throw new Error("Failed to update kit");
      const updatedKit = await response.json();
      toast({ title: "Kit updated", variant: "success" });
      setRecentKits((prev) =>
        prev.map((k) => (k.id === updatedKit.id ? updatedKit : k))
      );
      cancelEditKit();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update kit.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKit = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this kit?")) return;
    try {
      const response = await fetch(`${API.BASE}/kits/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete kit");
      toast({ title: "Kit deleted", variant: "success" });
      setRecentKits((prev) => prev.filter((k) => k.id !== id));
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete kit.",
        variant: "destructive",
      });
    }
  };

  // Resources
  const [resourceType, setResourceType] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [resourceFileUrl, setResourceFileUrl] = useState("");
  const [resourceFileName, setResourceFileName] = useState("");
  const [resourceVideoUrl, setResourceVideoUrl] = useState("");
  const [resourcePdfUrl, setResourcePdfUrl] = useState("");
  const [resourceReadTime, setResourceReadTime] = useState("");
  const [recentResources, setRecentResources] = useState<any[]>([]);
  const [editResourceId, setEditResourceId] = useState<number | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch(`${API.BASE}/resources`);
        if (!res.ok) throw new Error("Failed to fetch resources");
        const data = await res.json();
        setRecentResources(data);
      } catch {
        toast({
          title: "Error",
          description: "Could not load resources.",
          variant: "destructive",
        });
      }
    };
    fetchResources();
  }, [toast]);

  const onResourceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResourceFile(e.target.files[0]);
      setResourceFileUrl(URL.createObjectURL(e.target.files[0]));
      setResourceFileName(e.target.files[0].name);
    }
  };

  const cancelEditResource = () => {
    setEditResourceId(null);
    setResourceType("tutorial");
    setResourceTitle("");
    setResourceDescription("");
    setResourceReadTime("");
    setResourceFile(null);
    setResourceFileUrl("");
    setResourceFileName("");
    setResourceVideoUrl("");
    setResourcePdfUrl("");
  };

  const handleEditResourceClick = (resource: any) => {
    setEditResourceId(resource.id);
    setResourceType(resource.resource_type);
    setResourceTitle(resource.title);
    setResourceDescription(resource.description || "");
    setResourceReadTime(resource.read_time || "");
    setResourceFileUrl(resource.file_url || "");
    setResourceFile(null);
    setResourceFileName("");
    setResourceVideoUrl(resource.video_url || "");
    setResourcePdfUrl(resource.pdf_url || "");
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let fileUrl = "";
      let pdfUrl = "";
      if (resourceType === "tutorial" && resourceFile)
        fileUrl = await uploadFile(resourceFile);
      if (resourceType === "download" && resourceFile)
        pdfUrl = await uploadFile(resourceFile);

      const response = await fetch(`${API.BASE}/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resource_type: resourceType,
          title: resourceTitle,
          description: resourceDescription,
          file_url: resourceType === "tutorial" ? fileUrl : "",
          video_url: resourceType === "video" ? resourceVideoUrl : "",
          pdf_url: resourceType === "download" ? pdfUrl : "",
          read_time: resourceType === "tutorial" ? resourceReadTime : "",
        }),
      });
      if (!response.ok) throw new Error("Failed to add resource");
      const newResource = await response.json();

      toast({
        title: "Resource added!",
        description: "New learning resource added successfully.",
      });

      setResourceType("tutorial");
      setResourceTitle("");
      setResourceDescription("");
      setResourceReadTime("");
      setResourceFile(null);
      setResourceFileUrl("");
      setResourceFileName("");
      setResourceVideoUrl("");
      setResourcePdfUrl("");
      setRecentResources((prev) => [newResource, ...prev]);
    } catch {
      toast({
        title: "Error",
        description: "Failed to add resource.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editResourceId) return;
    try {
      let fileUrl = resourceFileUrl;
      let pdfUrl = resourcePdfUrl;
      if (resourceType === "tutorial" && resourceFile)
        fileUrl = await uploadFile(resourceFile);
      if (resourceType === "download" && resourceFile)
        pdfUrl = await uploadFile(resourceFile);

      const response = await fetch(`${API.BASE}/resources/${editResourceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resource_type: resourceType,
          title: resourceTitle,
          description: resourceDescription,
          file_url: resourceType === "tutorial" ? fileUrl : "",
          video_url: resourceType === "video" ? resourceVideoUrl : "",
          pdf_url: resourceType === "download" ? pdfUrl : "",
          read_time: resourceType === "tutorial" ? resourceReadTime : "",
        }),
      });
      if (!response.ok) throw new Error("Failed to update resource");
      const updatedResource = await response.json();

      toast({ title: "Resource updated", variant: "success" });
      setRecentResources((prev) =>
        prev.map((r) => (r.id === updatedResource.id ? updatedResource : r))
      );
      cancelEditResource();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update resource.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this resource?"))
      return;
    try {
      const response = await fetch(`${API.BASE}/resources/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete resource");
      toast({ title: "Resource deleted", variant: "success" });
      setRecentResources((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete resource.",
        variant: "destructive",
      });
    }
  };

  // Admin orders tab
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API.BASE}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch {
        toast({
          title: "Error",
          description: "Could not load orders.",
          variant: "destructive",
        });
      }
    };
    if (token) fetchOrders();
  }, [token, toast]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`${API.BASE}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update status",
          variant: "destructive",
        });
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast({
        title: "Status updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Status update failed:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage products, kits, and learning resources
          </p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="kits">Educational Kits</TabsTrigger>
            <TabsTrigger value="resources">Learning Resources</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>


          <TabsContent value="products">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{editProductId ? 'Edit Product' : 'Add New Product'}</CardTitle>
                  <CardDescription>{editProductId ? 'Edit product details' : 'Create a new product listing'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editProductId ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                    <div>
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input id="product-name" placeholder="Arduino Uno R3" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="product-description">Description</Label>
                      <Textarea id="product-description" placeholder="Product description..." value={productDescription} onChange={(e) => setProductDescription(e.target.value)} rows={3} required />
                    </div>
                    <div>
                      <Label htmlFor="product-price">Price</Label>
                      <Input id="product-price" type="text" placeholder="e.g. 24.99" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="product-features">Features</Label>
                      <Textarea id="product-features" placeholder="Features list..." value={productFeatures} onChange={(e) => setProductFeatures(e.target.value)} rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="product-included">Included</Label>
                      <Textarea id="product-included" placeholder="What is included with the product..." value={productIncluded} onChange={(e) => setProductIncluded(e.target.value)} rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="product-image">Image Upload</Label>
                      <Input id="product-image" type="file" accept="image/*" onChange={onImageChange} />
                      {productImageUrl && <img src={productImageUrl} alt="Preview" className="mt-2 max-w-xs" />}
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1">{editProductId ? 'Update Product' : 'Add Product'}</Button>
                      {editProductId && <Button variant="outline" onClick={cancelEdit} className="flex-1">Cancel</Button>}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Products</CardTitle>
                  <CardDescription>Manage existing products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentProducts.map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Rs. {product.price}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditClick(product)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          
          <TabsContent value="kits">
  <div className="grid md:grid-cols-2 gap-8">
    <Card>
      <CardHeader>
        <CardTitle>{editKitId ? 'Edit Educational Kit' : 'Add New Educational Kit'}</CardTitle>
        <CardDescription>{editKitId ? 'Edit educational kit details' : 'Create a new educational kit listing'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={editKitId ? handleUpdateKit : handleAddKit} className="space-y-4">
          <div>
            <Label htmlFor="kit-name">Kit Name</Label>
            <Input
              id="kit-name"
              placeholder="Arduino Starter Kit"
              value={kitName}
              onChange={(e) => setKitName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="kit-description">Description</Label>
            <Textarea
              id="kit-description"
              placeholder="Kit description..."
              value={kitDescription}
              onChange={(e) => setKitDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div>
            <Label htmlFor="kit-price">Price</Label>
            <Input
              id="kit-price"
              type="text"
              placeholder="e.g. 49.99"
              value={kitPrice}
              onChange={(e) => setKitPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="kit-image">Kit Image Upload</Label>
            <Input
              id="kit-image"
              type="file"
              accept="image/*"
              onChange={onKitImageChange}
            />
            {kitImageUrl && (
              <img src={kitImageUrl} alt="Kit Preview" className="mt-2 max-w-xs" />
            )}
          </div>
          <div>
            <Label htmlFor="kit-booklet">Kit Booklet Upload (PDF)</Label>
            <Input
              id="kit-booklet"
              type="file"
              accept="application/pdf"
              onChange={onKitBookletChange}
            />
            {kitBookletName && (
              <p className="mt-2 text-sm text-muted-foreground">{kitBookletName}</p>
            )}
          </div>
          {/* ✅ NEW INCLUDED FIELD */}
          <div>
            <Label htmlFor="kit-included">What's Included</Label>
            <Textarea
              id="kit-included"
              placeholder="e.g. Arduino Uno, Sensors, Breadboard, Jumper Wires, PDF Guide"
              value={kitIncluded}
              onChange={(e) => setKitIncluded(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">{editKitId ? 'Update Kit' : 'Add Kit'}</Button>
            {editKitId && (
              <Button variant="outline" onClick={cancelEditKit} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Recent Kits</CardTitle>
        <CardDescription>Manage existing educational kits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentKits.map((kit) => (
            <div
              key={kit.id}
              className="flex justify-between items-center p-3 border border-border rounded-lg"
            >
              <div>
                <p className="font-medium">{kit.name}</p>
                <p className="text-sm text-muted-foreground">₹{kit.price}</p>
                {kit.included && (
                  <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                    {kit.included}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" onClick={() => handleEditKitClick(kit)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDeleteKit(kit.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
</TabsContent>


          <TabsContent value="resources">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{editResourceId ? 'Edit Learning Resource' : 'Add New Learning Resource'}</CardTitle>
                  <CardDescription>{editResourceId ? 'Edit details' : 'Upload tutorials, videos, and downloads'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editResourceId ? handleUpdateResource : handleAddResource} className="space-y-4">
                    <div>
                      <Label htmlFor="resource-type">Resource Type</Label>
                      <select
  id="resource-type"
  className="w-full p-2 rounded border text-black bg-white dark:text-white dark:bg-black"
  value={resourceType}
  onChange={e => setResourceType(e.target.value as any)}
>
  <option value="" disabled>
    Select Resource Type
  </option>
  <option value="tutorial">Tutorial</option>
  <option value="video">Video</option>
  <option value="download">Download</option>
</select>

                    </div>
                    <div>
                      <Label htmlFor="resource-title">Title</Label>
                      <Input
                        id="resource-title"
                        placeholder="Resource title"
                        value={resourceTitle}
                        onChange={e => setResourceTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="resource-description">Description</Label>
                      <Textarea
                        id="resource-description"
                        placeholder="Resource description..."
                        value={resourceDescription}
                        onChange={e => setResourceDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    {resourceType === 'tutorial' && (
                      <>
                        <div>
                          <Label htmlFor="resource-file">Tutorial File Upload</Label>
                          <Input
                            id="resource-file"
                            type="file"
                            onChange={onResourceFileChange}
                          />
                          {resourceFileName && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {resourceFileName}
                            </p>
                          )}
                          {resourceFileUrl && !resourceFileName && (
                            <p className="mt-2 text-sm text-muted-foreground">{resourceFileUrl.split('/').pop()}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="resource-readtime">Read Time</Label>
                          <Input
                            id="resource-readtime"
                            placeholder="15 min read"
                            value={resourceReadTime}
                            onChange={e => setResourceReadTime(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    {resourceType === 'video' && (
                      <>
                        <div>
                          <Label htmlFor="resource-video">YouTube Video URL</Label>
                          <Input
                            id="resource-video"
                            placeholder="https://youtube.com/watch?v=..."
                            value={resourceVideoUrl}
                            onChange={e => setResourceVideoUrl(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    {resourceType === 'download' && (
                      <>
                        <div>
                          <Label htmlFor="resource-pdf">PDF Download</Label>
                          <Input
                            id="resource-pdf"
                            type="file"
                            accept="application/pdf"
                            onChange={onResourceFileChange}
                          />
                          {resourceFileName && (
                            <p className="mt-2 text-sm text-muted-foreground">{resourceFileName}</p>
                          )}
                          {resourceFileUrl && !resourceFileName && (
                            <p className="mt-2 text-sm text-muted-foreground">{resourceFileUrl.split('/').pop()}</p>
                          )}
                        </div>
                      </>
                    )}
                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1">{editResourceId ? 'Update Resource' : 'Add Resource'}</Button>
                      {editResourceId && (
                        <Button variant="outline" onClick={cancelEditResource} className="flex-1">Cancel</Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Resources</CardTitle>
                  <CardDescription>Manage learning resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentResources.map((resource) => (
                      <div key={resource.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                          <span className="text-xs text-muted-foreground block">
                            {resource.resource_type === 'tutorial' && resource.read_time}
                            {resource.resource_type === 'video' && 'Video'}
                            {resource.resource_type === 'download' && 'Download'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditResourceClick(resource)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteResource(resource.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

<TabsContent value="orders">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-xl">Orders</CardTitle>
                <CardDescription className="text-sm">
                  All customer orders
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      No orders yet.
                    </p>
                  </div>
                )}

                <div className="grid gap-4 p-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-border rounded-md px-4 py-3 space-y-2 text-sm bg-background hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold truncate max-w-[60%]">
                          {order.customer_name}
                        </span>
                        <span className="font-semibold">
                          ₹{order.total_amount}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 truncate flex-1">
                          📞 {order.customer_phone || "No phone"}
                        </div>
                        <div className="flex items-center gap-1 truncate flex-1">
                          ✉️ {order.customer_email}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        📍 {order.customer_city || "N/A"},{" "}
                        {order.customer_pincode || "N/A"}
                      </div>

                      <div className="text-xs text-muted-foreground break-words max-h-[40px] overflow-hidden">
                        <span className="font-medium text-foreground/80">
                          Address:{" "}
                        </span>
                        {order.customer_address || "No address"}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        📅 {new Date(order.created_at).toLocaleDateString()}{" "}
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <div className="border-t border-border/60 pt-2 mt-1 space-y-1">
                        {order.items?.slice(0, 2).map((item: any) => (
                          <div
                            key={item.product_id}
                            className="flex justify-between text-xs"
                          >
                            <span className="truncate max-w-[70%]">
                              {item.product_name} × {item.quantity}
                            </span>
                            <span>₹{item.line_total}</span>
                          </div>
                        ))}
                        {order.items && order.items.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{order.items.length - 2} more
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "paid" ||
                                order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>

                        {order.status === "cancelled" ? (
                          <button
                            className="text-[10px] text-muted-foreground underline hover:text-foreground"
                            onClick={() =>
                              setOrders((prev) =>
                                prev.filter((o) => o.id !== order.id)
                              )
                            }
                          >
                            Remove
                          </button>
                        ) : (
                          <select
                            className="border border-border rounded px-2 py-1 text-xs bg-background text-foreground hover:border-border focus:border-border focus:outline-none"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;