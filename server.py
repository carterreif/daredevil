from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

# Change to the public directory
os.chdir('public')

# Create server
server_address = ('', 8000)
httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)

print('Server running on http://localhost:8000')
httpd.serve_forever()
