<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "Digitalna galerija API",
    version: "1.0.0"
)]
#[OA\Server(
    url: "http://localhost:8000",
    description: "Local server"
)]
class SwaggerController extends Controller
{
    #[OA\Get(
        path: "/api/health",
        summary: "Health check",
        tags: ["System"],
        responses: [
            new OA\Response(response: 200, description: "OK")
        ]
    )]
    public function health() {}

    // authentication
    #[OA\Post(
        path: "/api/register",
        summary: "Register new user",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: "object",
                properties: [
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "email", type: "string", format: "email"),
                    new OA\Property(property: "password", type: "string", format: "password")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "User registered"),
            new OA\Response(response: 400, description: "Validation error")
        ]
    )]
    public function register() {}

    #[OA\Post(
        path: "/api/login",
        summary: "User login",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: "object",
                properties: [
                    new OA\Property(property: "email", type: "string"),
                    new OA\Property(property: "password", type: "string", format: "password")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Token returned"),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function login() {}

    #[OA\Post(
        path: "/api/logout",
        summary: "User logout",
        tags: ["Auth"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Logged out"),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function logout() {}

    // artworks
    #[OA\Get(
        path: "/api/artworks",
        summary: "List all artworks",
        tags: ["Artworks"],
        responses: [
            new OA\Response(response: 200, description: "List returned")
        ]
    )]
    public function artworksIndex() {}

    #[OA\Get(
        path: "/api/artworks/user",
        summary: "List artworks for user",
        tags: ["Artworks"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "User artworks"),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function artworksUser() {}

    #[OA\Get(
        path: "/api/artworks/{id}",
        summary: "Get single artwork",
        tags: ["Artworks"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Artwork data"),
            new OA\Response(response: 404, description: "Not found")
        ]
    )]
    public function artworksShow() {}

    #[OA\Post(
        path: "/api/artworks",
        summary: "Create artwork",
        tags: ["Artworks"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(type: "object")
        ),
        responses: [
            new OA\Response(response: 200, description: "Created"),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function artworksStore() {}

    #[OA\Put(
        path: "/api/artworks/{artwork}",
        summary: "Update artwork",
        tags: ["Artworks"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "artwork", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(type: "object")
        ),
        responses: [
            new OA\Response(response: 200, description: "Updated"),
            new OA\Response(response: 401, description: "Unauthorized"),
            new OA\Response(response: 404, description: "Not found")
        ]
    )]
    public function artworksUpdate() {}

    #[OA\Delete(
        path: "/api/artworks/{artwork}",
        summary: "Delete artwork",
        tags: ["Artworks"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "artwork", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Deleted"),
            new OA\Response(response: 401, description: "Unauthorized"),
            new OA\Response(response: 404, description: "Not found")
        ]
    )]
    public function artworksDestroy() {}

    // categories
    #[OA\Get(
        path: "/api/categories",
        summary: "List categories",
        tags: ["Categories"],
        responses: [
            new OA\Response(response: 200, description: "List returned")
        ]
    )]
    public function categoriesIndex() {}

    // exhibitions
    #[OA\Get(
        path: "/api/exhibitions",
        summary: "Public exhibitions",
        tags: ["Exhibitions"],
        responses: [
            new OA\Response(response: 200, description: "List returned")
        ]
    )]
    public function exhibitionsIndex() {}

    #[OA\Get(
        path: "/api/exhibitions/user",
        summary: "User exhibitions",
        tags: ["Exhibitions"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "List returned"),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function exhibitionsUser() {}

    #[OA\Post(
        path: "/api/exhibitions",
        summary: "Create exhibition",
        tags: ["Exhibitions"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(type: "object")),
        responses: [
            new OA\Response(response: 200, description: "Created"),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function exhibitionsStore() {}

    #[OA\Put(
        path: "/api/exhibitions/{exhibition}",
        summary: "Update exhibition",
        tags: ["Exhibitions"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "exhibition", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(type: "object")),
        responses: [
            new OA\Response(response: 200, description: "Updated"),
            new OA\Response(response: 401, description: "Unauthorized"),
            new OA\Response(response: 404, description: "Not found")
        ]
    )]
    public function exhibitionsUpdate() {}

    #[OA\Delete(
        path: "/api/exhibitions/{exhibition}",
        summary: "Delete exhibition",
        tags: ["Exhibitions"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "exhibition", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Deleted"),
            new OA\Response(response: 401, description: "Unauthorized"),
            new OA\Response(response: 404, description: "Not found")
        ]
    )]
    public function exhibitionsDestroy() {}

    #[OA\Get(
        path: "/api/exhibitions/{id}",
        summary: "Get single exhibition",
        tags: ["Exhibitions"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Exhibition data"),
            new OA\Response(response: 404, description: "Not found")
        ]
    )]
    public function exhibitionsShow() {}

    // images
    #[OA\Post(
        path: "/api/images/upload",
        summary: "Upload image",
        tags: ["Images"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(type: "object", properties: [
                    new OA\Property(property: "file", type: "string", format: "binary")
                ])
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Uploaded"),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function imagesUpload() {}

    #[OA\Get(
        path: "/api/images",
        summary: "List images",
        tags: ["Images"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "List returned"),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function imagesIndex() {}

    #[OA\Delete(
        path: "/api/images/{id}",
        summary: "Delete image",
        tags: ["Images"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Deleted"),
            new OA\Response(response: 401, description: "Unauthorized"),
            new OA\Response(response: 404, description: "Not found")
        ]
    )]
    public function imagesDestroy() {}

    #[OA\Get(
        path: "/api/images/external",
        summary: "Fetch external images",
        tags: ["Images"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Fetched"),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function imagesExternal() {}

    #[OA\Get(
        path: "/api/user",
        summary: "Get current user",
        tags: ["Users"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "User data"),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function userGet() {}

    #[OA\Get(
        path: "/api/admin/statistics",
        summary: "Admin statistics",
        tags: ["Admin"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Stats"),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function adminStatistics() {}
}

