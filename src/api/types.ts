// DTOs mirrored from the backend Swagger spec (http://localhost:8080/swagger/doc.json).
// Field names match the Go structs exactly (PascalCase); pgtype.* columns are nullable.

export type UserRole = 'user' | 'admin';

export interface LoginRequest {
    Username: string;
    // The backend expects the plain password in this field.
    HashedPassword: string;
}

export interface TokenPair {
    access_token: string;
    refresh_token: string;
}

export interface User {
    ID: number;
    Username: string;
    Role: UserRole;
    CreatedAt: string;
}

export interface Category {
    ID: number;
    Name: string;
    Slug: string;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface Product {
    ID: number;
    CategoryID: number | null;
    Name: string;
    Slug: string;
    Description: string;
    IsActive: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface CreateProductRequest {
    Name: string;
    Slug: string;
    Description: string;
    CategoryID: number | null;
    IsActive: boolean;
}

export interface ProductVariant {
    ID: number;
    ProductID: number;
    Name: string;
    Price: number;
    WholesalePrice: number | null;
    WholesaleMinQty: number | null;
    IsActive: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface CreateVariantRequest {
    ProductID: number;
    Name: string;
    Price: number;
    WholesalePrice: number | null;
    WholesaleMinQty: number | null;
    IsActive: boolean;
}

export interface ProductImage {
    ID: number;
    ProductID: number;
    VariantID: number | null;
    S3Key: string;
    ContentType: string;
    Position: number;
    CreatedAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
    ID: number;
    CustomerName: string;
    CustomerPhone: string;
    Comment: string | null;
    Status: OrderStatus;
    TotalPrice: number;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface OrderItem {
    ID: number;
    OrderID: number;
    ProductVariantID: number;
    ProductName: string;
    VariantName: string;
    Quantity: number;
    UnitPrice: number;
}

export interface OrderDetails extends Order {
    Items: OrderItem[];
}
