import socket


s = socket.socket()
print("socket succesfully created")

port = 56789

s.bind(("",port))

