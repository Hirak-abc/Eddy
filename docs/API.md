# Eddy — API Documentation

All endpoints use the `/api` prefix and return the standard response shape:

```json
{"success":true,"data":{},"error":null}
```

Errors use `success: false`, `data: null`, and an `error` object with a
machine-readable `code` and user-facing `message`. Protected routes require a
Clerk bearer token. Flyer endpoints require an `OWNER`; coupon claim/list/use
endpoints require a `CUSTOMER`; coupon request-management endpoints require an
`OWNER`.

## Business Profile Images

Images are stored in Convex Storage. Convex stores the storage ID, owner, slot,
and upload timestamp.

### List saved images

`GET /api/business-profile/images`

Returns the owner's images in `data.images`. Each entry contains `slot`
(`shop`, `product`, or `item`), `storageKey`, `url`, and `uploadedAt`.

### Upload or replace an image

`PUT /api/business-profile/images/{slot}`

Send raw file bytes with `Content-Type: application/octet-stream` and an
`X-Image-Content-Type` header matching the file (`image/jpeg`, `image/png`, or
`image/webp`). Files are limited to 10 MB. The server checks the image
signature before saving and returns the stored image in `data.image`.

### Delete a saved image

`DELETE /api/business-profile/images/{slot}`

Removes the image from Convex Storage and deletes its slot reference. Saving
all three slots from the owner profile queues an automatic flyer; it no longer
publishes a raw photo.

## Flyers

Flyer generation and publishing endpoints require an owner token. Flyer jobs
are persisted in Convex and processed by the backend publishing worker.

### List flyers

`GET /api/flyers`

Returns the authenticated owner's flyer records and generation/publication
status. Coupon code hashes are never returned.

### Queue an automatic flyer

`POST /api/flyers/automatic`

Request body:

```json
{
  "businessName": "Example Shop",
  "businessCategory": "Cafe",
  "businessLocation": "Lucknow",
  "language": "HINGLISH"
}
```

`language` is `HINDI`, `ENGLISH`, or `HINGLISH`. All three saved business image
slots must exist. The server picks one at random, asks xAI to research a
current India-relevant trend and generate flyer artwork/copy, then schedules
the generated flyer for Facebook and Instagram 72 hours after generation.
The request returns `202 Accepted` with the queued flyer in `data.flyer`.

### Upload a source image for a custom flyer

`POST /api/flyers/images`

Send raw image bytes as `application/octet-stream` (maximum 10 MB). The server
validates and stores the image in Convex Storage. The response includes its
public URL in `data.image.url`.

### Queue a custom flyer

`POST /api/flyers/generate`

Request body:

```json
{
  "businessName": "Example Shop",
  "businessCategory": "Cafe",
  "businessLocation": "Lucknow",
  "topic": "Diwali Festival",
  "language": "HINDI",
  "imageUrl": "https://storage.example/source.jpg"
}
```

`imageUrl` must be HTTPS and publicly accessible to xAI. The topic can be
typed by the owner or selected from the frontend suggestions. The server enforces a single generation per owner in any rolling 72-hour
period across both automatic and custom flyers. Generation returns
`202 Accepted`; the owner can track status in Flyer Studio. Every generated
flyer is scheduled to Facebook and Instagram 72 hours after generation by
default. The owner can change the scheduled time in Flyer Studio, or publish a
custom flyer immediately.

### Publish a ready custom flyer immediately

`POST /api/flyers/{id}/publish`

Publishes the ready custom flyer to the owner's active Facebook Page and
Instagram professional account. Returns the social post in `data.post`.

### Schedule a ready custom flyer

`POST /api/flyers/{id}/schedule`

Request body:

```json
{"scheduledAt":"2030-10-15T10:30:00.000Z"}
```

The timestamp must be in the future. The ready custom flyer is queued for the
selected time on both connected platforms.

## Flyer Coupons

Every successfully generated flyer receives one server-generated, unique
eight-character code and one discount chosen with these probabilities:

- 3% discount: 50%
- 5% discount: 45%
- 10% discount: 5%

The flyer image shows the code in a CAPTCHA-style overlay. The plaintext code
is not stored in Convex; only its hash is stored. Flyer codes are one-time and
expire 96 hours after generation.

### Claim a flyer code

`POST /api/coupons/claim` (customer)

Request body: `{"code":"AB12CD34"}`. An atomic claim assigns the code to the
first customer to redeem it and returns the coupon in `data.coupon`. Invalid,
expired, or already-claimed codes are rejected.

### List the customer's available coupons

`GET /api/coupons/mine` (customer)

Returns the authenticated customer's unexpired coupons that have not been
approved as redeemed.

### Request coupon use

`POST /api/coupons/{id}/request` (customer)

The customer requests use of a coupon at the issuing shop. The request appears
in that owner's coupon dashboard with the customer's name.

### List the owner's pending requests

`GET /api/coupons/owner/requests` (owner)

Returns only pending requests for coupons issued by the authenticated owner.

### Approve a request

`PATCH /api/coupons/owner/requests/{id}/approve` (owner)

Request body: `{"billAmount":100}`. The owner supplies the purchase total;
Convex atomically applies the percentage discount, marks the coupon used, and
records the discount amount in the owner's coupon-balance ledger. The approved
coupon is removed from the customer's available coupons.

### Reject a request

`PATCH /api/coupons/owner/requests/{id}/reject` (owner)

Rejects a pending request. The customer can submit a new request for the
coupon, provided it has not expired.

### Read the owner's coupon balance and ledger

`GET /api/coupons/owner/balance` (owner)

Returns the accumulated coupon balance and its immutable transaction history.

## Server Configuration

Set `XAI_API_KEY`, `CONVEX_URL`, and `EDDY_CONVEX_SECRET` in the backend
environment. Set the same `EDDY_CONVEX_SECRET` value in the Convex deployment
environment so flyer and coupon functions accept calls from the backend. Do
not expose these values in frontend configuration. Meta publishing additionally
requires connected, active Facebook and Instagram accounts and valid Meta
publishing permissions.
