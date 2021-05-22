# snarl
The Sockets Network Adapter Reciprocating Listener is part of the overall Rabbie project (I'll link later).  

##Screenshot
![screen shot of parsed bytes in ARP packet](https://github.com/0bOne/snarl/blob/main/snarl.png "Screenshot")

##Purpose
It is a utility designed to help develop network adapter drivers on BOCHS and QEMU.
Bochs already has a BXHub, but it needs two machines up and running, which is cumbersome when developing an OS, so I created this to give fine-grained control at the packet level for these emulators.

##Features
At present, it listens on a UDP socket for ARP requests and responds with an ARP  response.
I chose this as the first feature simply because ARP is by far the easiest frame to generate when building a network adapter driver in assembly (or C).
As [RFS 826](https://datatracker.ietf.org/doc/html/rfc826) specifies, it modifies the inbound packet for efficiency and sends at the response. An ARP request needs only 50 bytes, and many network cards reject "runt" packets lower than 64 bytes, so when developing your protocol stack, be sure to send at least 64 bytes, padded with zeros. 

##Roadmap
I don't get a lot of time to work on this, but the concept is fairly simple if anyone wants to contribute.  IF not, on the horizon is:
* IPV4 parsing
* DHCP response

##Launching
simply change to the folder containing this code and run
node.exe  snarl.js   

##Dependencies
Needs only the node executable to run. At time of writing that is node v16.0.0.  

##Configuration
Configuration is done by editing the config.json file. It is fairly self-explanatory, but just in case:
* **udpsockets.in**   The UDP port on which it listens for packets. Should not need changing.
* **uppscokets.out**  The UDP port to which it sends responses. Should not need changing.
* **me.MAC**          The Media-Access-Control (physical) address it pretends to have as a host machine. Should not need changing unless you want to use a particularly recognizable value, or in the unlikely event of a conflict.
* **me.IP**           The IPv4 address it presents to have as a host machine. May or may not need changing depending on your network requirements.
* **arpCache**        A simulated ARP cache that it will use to generate the response. Should include whatever IP addresses you are requesting.  Of course, set the MAC addresses to any values that don't conflict on your network (not that it will matter much as this is a 'close' system, but it may help avoid confusion)

##Bochs
My bxrc config file is configured for an NE2000 compatible adapter.
NOTE: Bochs PCI will list the vendor/model code as 0x802910ec which is a RTL-8029 card. But it is NOT!  I spent many hours scratching my head over the wrong documentation.  It operates as a RTL8139, which has subtle differences, and should be an entirely different PCI model code!. Rant aside, the configuration looks like this:
```
ne2k: enabled=1, mac=B0:C5:AA:BB:CC:02, ethmod=socket, ethdev=40000, script=""
```
I have reliably sent and received packets (observed in the ring buffer) on Bochs.

##QEMU
My QEMU confguration needs a word of caution.  I haven't (yet) confirmed the inbound packet is received by QEMU. So far, I have seen no evidence of it.  I suspect my knowledge of QEMU is lacking -- I cannot figure out how to find/query the ring buffer RAM.  If anyone has any pointers, I will be eternally grateful.

NIC command-line arguments:
```
-net nic,netdev=mynet1,model=ne2k_pci,macaddr=B0:C5:AA:BB:CC:02
```
NETDEV command-line arguments:
```
SET NETDEV1=-netdev type=socket,id=mynet1,udp=%COMPUTERNAME%:40001,localaddr=0.0.0.0:40000
```
The ```%COMPUTERNAME%``` argument is a windows command variable.  If you are on Linux, a bash script would be ```$HOSTNAME``` (it's been a few years, so check for yourself).


##Acknowldgements and feedback
Thanks to the awesome folks at [NodeJs](https://nodejs.org/), [Bochs](https://bochs.sourceforge.io/), and [Qemu](https://www.qemu.org/), and all the helpful hints and tips at [OSDev](https://wiki.osdev.org/Main_Page).

If anyone has any bugs, tips, enhancements, or suggestions, please let me know!












