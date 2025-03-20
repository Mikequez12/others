import time
import random
import os

l = 'abcdefghijklmnñopqrtstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890'

def getRandom():
  return l[random.randint(0,len(l)-1)]

for i in range(1000):
  print(getRandom(),end='')

  time.sleep(random.randint(0,100)/100)

os.system('clear')

print('Abort [done]')
