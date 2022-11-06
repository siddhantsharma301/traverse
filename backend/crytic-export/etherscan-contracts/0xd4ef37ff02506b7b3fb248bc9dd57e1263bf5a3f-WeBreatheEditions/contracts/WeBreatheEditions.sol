
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/// @title: We Breathe | Editions
/// @author: manifold.xyz

import "./ERC1155Creator.sol";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                           //
//                                                                                                                           //
//                     ___.                         __  .__                        .___.__  __  .__                          //
//    __  _  __ ____   \_ |_________   ____ _____ _/  |_|  |__   ____     ____   __| _/|__|/  |_|__| ____   ____   ______    //
//    \ \/ \/ // __ \   | __ \_  __ \_/ __ \\__  \\   __\  |  \_/ __ \  _/ __ \ / __ | |  \   __\  |/  _ \ /    \ /  ___/    //
//     \     /\  ___/   | \_\ \  | \/\  ___/ / __ \|  | |   Y  \  ___/  \  ___// /_/ | |  ||  | |  (  <_> )   |  \\___ \     //
//      \/\_/  \___  >  |___  /__|    \___  >____  /__| |___|  /\___  >  \___  >____ | |__||__| |__|\____/|___|  /____  >    //
//                 \/       \/            \/     \/          \/     \/       \/     \/                         \/     \/     //
//                                                                                                                           //
//                                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


contract WeBreatheEditions is ERC1155Creator {
    constructor() ERC1155Creator() {}
}